import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Server } from "node:http";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { WebSocketServer } from "ws";
import {
  CaptureSubmitSchema,
  ElementCaptureSchema,
  TaskStatusSchema,
} from "@noted/shared";

import { config } from "./config.js";
import { TaskStore } from "./db.js";
import { diffCaptures } from "./diff.js";
import { buildInterpretationBrief } from "./prompts/task-from-capture.js";
import { tryOllamaSynthesis } from "./ollama.js";
import { resolveSynthesis } from "./synthesis.js";
import { WsHub } from "./ws-hub.js";

export function createApp(store: TaskStore, hub: WsHub) {
  const app = new Hono();

  const defaultOrigins = [
    /^http:\/\/127\.0\.0\.1:\d+$/,
    /^http:\/\/localhost:\d+$/,
  ];

  app.use(
    "*",
    cors({
      origin: (origin) => {
        if (!origin) return "*";
        if (config.allowedOrigins.includes(origin)) return origin;
        if (defaultOrigins.some((re) => re.test(origin))) return origin;
        return null;
      },
    }),
  );

  app.get("/health", (c) =>
    c.json({
      ok: true,
      service: "noted-daemon",
      notedJs: existsSync(config.captureScriptPath),
      notedJsPath: config.captureScriptPath,
      synthesis: config.synthesis,
    }),
  );

  app.get("/v1/config", (c) =>
    c.json({
      synthesis: config.synthesis,
      requireApproval: config.requireApproval,
      ollamaModel: config.ollamaModel,
      port: config.port,
    }),
  );

  app.get("/noted.js", (c) => {
    if (!existsSync(config.captureScriptPath)) {
      return c.text("/* build @noted/capture first */", 404);
    }
    const js = readFileSync(config.captureScriptPath);
    return c.body(js, 200, {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    });
  });

  app.post("/v1/capture", async (c) => {
    const t0 = performance.now();
    const body = CaptureSubmitSchema.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: body.error.flatten() }, 400);

    const { capture, comment } = body.data;
    const id = randomUUID();
    const { agentTask, source, llmMs, interpretation } = await resolveSynthesis(
      capture,
      comment,
    );

    const initialStatus = config.requireApproval ? "pending_approval" : "pending";
    const record = store.insert({
      id,
      comment,
      capture,
      agentTask,
      status: initialStatus,
    });
    const totalMs = Math.round(performance.now() - t0);

    hub.broadcast({
      type: "task_created",
      task: record,
      timing: { totalMs, llmMs, source },
      interpretation,
    });

    return c.json({
      taskId: id,
      agentTask,
      interpretation,
      timingMs: totalMs,
      llmMs,
      source,
    });
  });

  app.get("/v1/tasks", (c) => {
    const statusRaw = c.req.query("status");
    const status = statusRaw ? TaskStatusSchema.safeParse(statusRaw) : null;
    if (statusRaw && !status?.success) return c.json({ error: "invalid status" }, 400);
    let tasks = store.list(status?.data);
    if (c.req.query("readyForAgent") === "1") {
      tasks = tasks.filter((t) => t.status !== "pending_approval");
    }
    return c.json({ tasks });
  });

  app.get("/v1/tasks/:id", (c) => {
    const task = store.get(c.req.param("id"));
    if (!task) return c.json({ error: "not found" }, 404);
    const interpretation = buildInterpretationBrief(task.capture, task.comment);
    return c.json({ task, interpretation });
  });

  app.post("/v1/tasks/:id/synthesize", async (c) => {
    const task = store.get(c.req.param("id"));
    if (!task) return c.json({ error: "not found" }, 404);
    const ollama = await tryOllamaSynthesis(task.capture, task.comment, {
      url: config.ollamaUrl,
      model: config.ollamaModel,
    });
    if (!ollama) {
      return c.json({ error: "ollama_unavailable", hint: "Use MCP + your agent, or start Ollama" }, 503);
    }
    const updated = store.updateAgentTask(task.id, ollama.task);
    hub.broadcast({ type: "task_updated", task: updated, timing: { llmMs: ollama.ms, source: "ollama" } });
    return c.json({ task: updated, llmMs: ollama.ms, source: "ollama" });
  });

  app.post("/v1/tasks/:id/approve", (c) => {
    const task = store.get(c.req.param("id"));
    if (!task) return c.json({ error: "not found" }, 404);
    if (task.status !== "pending_approval") {
      return c.json({ error: "not_pending_approval", status: task.status }, 400);
    }
    const updated = store.setStatus(task.id, "pending");
    hub.broadcast({ type: "task_updated", task: updated });
    return c.json({ task: updated });
  });

  app.patch("/v1/tasks/:id/status", async (c) => {
    const body = (await c.req.json()) as { status?: string };
    const parsed = TaskStatusSchema.safeParse(body.status);
    if (!parsed.success) return c.json({ error: "invalid status" }, 400);
    const updated = store.setStatus(c.req.param("id"), parsed.data);
    hub.broadcast({ type: "task_updated", task: updated });
    return c.json({ task: updated });
  });

  app.post("/v1/tasks/:id/verify", (c) => {
    const task = store.get(c.req.param("id"));
    if (!task) return c.json({ error: "not found" }, 404);
    hub.broadcast({
      type: "verify",
      taskId: task.id,
      notedId: task.capture.notedId,
    });
    return c.json({ ok: true, notedId: task.capture.notedId });
  });

  app.post("/v1/tasks/:id/verify-capture", async (c) => {
    const task = store.get(c.req.param("id"));
    if (!task) return c.json({ error: "not found" }, 404);
    const json = (await c.req.json()) as { capture?: unknown };
    const body = ElementCaptureSchema.safeParse(json.capture);
    if (!body.success) return c.json({ error: body.error.flatten() }, 400);
    const diff = diffCaptures(task.id, task.capture, body.data);
    const updated = store.setStyleDiff(task.id, diff);
    hub.broadcast({ type: "task_verified", task: updated, diff });
    return c.json({ task: updated, diff });
  });

  return app;
}

function attachWebSocket(server: Server, hub: WsHub): void {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    if (req.url?.split("?")[0] !== "/v1/ws") {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      const client = { send: (d: string) => ws.send(d) };
      hub.add(client);
      ws.on("close", () => hub.remove(client));
    });
  });
}

export function startServer(store: TaskStore, hub: WsHub) {
  const app = createApp(store, hub);
  const server = serve({ fetch: app.fetch, port: config.port, hostname: config.host });
  const httpServer = server as Server;
  httpServer.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${config.port} already in use — daemon likely running. Check http://127.0.0.1:${config.port}/health`,
      );
      process.exit(0);
    }
    throw err;
  });
  attachWebSocket(httpServer, hub);
  return server;
}
