import type { AgentTask, ElementCapture } from "@noted/shared";

import { config } from "./config.js";
import { heuristicTask } from "./heuristic-task.js";
import { tryOllamaSynthesis } from "./ollama.js";
import { buildInterpretationBrief } from "./prompts/task-from-capture.js";

export type SynthesisSource = "agent" | "ollama" | "none" | "heuristic";

export type SynthesisResult = {
  agentTask: AgentTask | null;
  source: SynthesisSource;
  llmMs: number;
  interpretation: ReturnType<typeof buildInterpretationBrief>;
};

export async function resolveSynthesis(
  capture: ElementCapture,
  comment: string,
): Promise<SynthesisResult> {
  const interpretation = buildInterpretationBrief(capture, comment);

  if (config.synthesis === "agent") {
    return { agentTask: null, source: "agent", llmMs: 0, interpretation };
  }

  const ollama = await tryOllamaSynthesis(capture, comment, {
    url: config.ollamaUrl,
    model: config.ollamaModel,
  });

  if (ollama) {
    return {
      agentTask: ollama.task,
      source: "ollama",
      llmMs: ollama.ms,
      interpretation,
    };
  }

  if (config.heuristicFallback) {
    return {
      agentTask: heuristicTask(capture, comment),
      source: "heuristic",
      llmMs: 0,
      interpretation,
    };
  }

  return { agentTask: null, source: "none", llmMs: 0, interpretation };
}
