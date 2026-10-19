import { AgentTaskSchema, type AgentTask, type ElementCapture } from "@noted/shared";

import { TASK_SYSTEM_PROMPT, buildUserPrompt } from "./prompts/task-from-capture.js";

const TIMEOUT_MS = 12_000;

export async function tryOllamaSynthesis(
  capture: ElementCapture,
  comment: string,
  opts: { url: string; model: string },
): Promise<{ task: AgentTask; ms: number } | null> {
  const t0 = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${opts.url}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: opts.model,
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: TASK_SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(capture, comment) },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { message?: { content?: string } };
    const raw = data.message?.content ?? "";
    const parsed = AgentTaskSchema.parse(JSON.parse(raw));
    return { task: parsed, ms: Math.round(performance.now() - t0) };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function checkOllama(url: string, model: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const tags = await fetch(`${url}/api/tags`);
    if (!tags.ok) return { ok: false, detail: `Ollama unreachable (${tags.status})` };
    const data = (await tags.json()) as { models?: { name: string }[] };
    const has = data.models?.some((m) => m.name.startsWith(model.split(":")[0] ?? model));
    return has
      ? { ok: true, detail: `Model ${model} available` }
      : { ok: false, detail: `Pull with: ollama pull ${model}` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : "Ollama unreachable" };
  }
}
