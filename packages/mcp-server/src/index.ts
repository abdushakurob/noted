#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { daemonFetch } from "./daemon-client.js";

const server = new McpServer({ name: "noted", version: "0.1.0" });

server.registerTool(
  "noted_list_tasks",
  {
    description: "List note'd feedback tasks, optionally filtered by status",
    inputSchema: z.object({
      status: z
        .enum([
          "pending_approval",
          "pending",
          "sent_to_agent",
          "applied",
          "verified",
          "resolved",
        ])
        .optional(),
      readyForAgent: z.boolean().optional(),
    }),
  },
  async ({ status, readyForAgent }) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (readyForAgent) params.set("readyForAgent", "1");
    const q = params.size ? `?${params}` : "";
    const data = await daemonFetch(`/v1/tasks${q}`);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  },
);

server.registerTool(
  "noted_get_task",
  {
    description:
      "Get structured capture, client comment, and interpretation brief. When agentTask is null, YOU (the coding agent) interpret the payload — do not guess from screenshots.",
    inputSchema: z.object({ id: z.string() }),
  },
  async ({ id }) => {
    const data = await daemonFetch(`/v1/tasks/${id}`);
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  },
);

server.registerTool(
  "noted_mark_task_status",
  {
    description: "Update task lifecycle status",
    inputSchema: z.object({
      id: z.string(),
      status: z.enum([
        "pending_approval",
        "pending",
        "sent_to_agent",
        "applied",
        "verified",
        "resolved",
      ]),
    }),
  },
  async ({ id, status }) => {
    const data = await daemonFetch(`/v1/tasks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  },
);

server.registerTool(
  "noted_approve_task",
  {
    description:
      "Approve a task after reviewing Gemma's spec. Moves pending_approval → pending so the agent may implement.",
    inputSchema: z.object({ id: z.string() }),
  },
  async ({ id }) => {
    const data = await daemonFetch(`/v1/tasks/${id}/approve`, { method: "POST" });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.registerTool(
  "noted_synthesize_task",
  {
    description: "Run local Ollama/Gemma on an existing task (retry if capture had no spec).",
    inputSchema: z.object({ id: z.string() }),
  },
  async ({ id }) => {
    const data = await daemonFetch(`/v1/tasks/${id}/synthesize`, { method: "POST" });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
);

server.registerTool(
  "noted_verify_task",
  {
    description:
      "Ask the browser capture script to re-scan the element and compute a style diff",
    inputSchema: z.object({ id: z.string() }),
  },
  async ({ id }) => {
    const data = await daemonFetch(`/v1/tasks/${id}/verify`, { method: "POST" });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ...data,
              hint: "Ensure noted.js is loaded on the target page; verify completes via WebSocket.",
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
