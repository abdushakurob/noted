import type { ElementCapture } from "@noted/shared";

export const TASK_SYSTEM_PROMPT = `You are note'd, a freelancer feedback assistant. Output ONLY valid JSON matching this schema:
{
  "summary": string,
  "intent": "visual"|"layout"|"copy"|"a11y"|"bug"|"other",
  "acceptance_criteria": string[],
  "suggested_changes": [{"kind":"css"|"dom"|"component"|"file"|"other","target":string,"detail":string}],
  "confidence": number,
  "assumptions": string[]
}
Use the structured capture facts. Prefer measurable CSS/layout/a11y fixes. No markdown.`;

export function buildUserPrompt(capture: ElementCapture, comment: string): string {
  return JSON.stringify({
    client_comment: comment,
    capture: {
      selector: capture.selectorPath,
      notedId: capture.notedId,
      layout: capture.layout,
      styles: capture.styles,
      contrastRatio: capture.contrastRatio,
      a11y: capture.a11y,
      framework: capture.framework,
      page: capture.page,
      dom: capture.dom,
    },
  });
}

/** What we hand to Cursor / Claude — not a canned task, the facts + framing. */
export function buildInterpretationBrief(capture: ElementCapture, comment: string) {
  return {
    clientComment: comment,
    instructionsForAgent:
      "Implement this client feedback using the structured capture below (measured CSS/layout/a11y — not a screenshot). " +
      "Prefer changes that satisfy testable acceptance criteria (px, contrast ratio, fold visibility). " +
      "Use framework hints when present. Call noted_mark_task_status when done.",
    agentTaskSchema: TASK_SYSTEM_PROMPT,
    payload: JSON.parse(buildUserPrompt(capture, comment)) as object,
  };
}
