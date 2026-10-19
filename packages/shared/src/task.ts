import { z } from "zod";

import { ElementCaptureSchema } from "./capture.js";

export const TaskStatusSchema = z.enum([
  "pending_approval",
  "pending",
  "sent_to_agent",
  "applied",
  "verified",
  "resolved",
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskIntentSchema = z.enum([
  "visual",
  "layout",
  "copy",
  "a11y",
  "bug",
  "other",
]);
export type TaskIntent = z.infer<typeof TaskIntentSchema>;

export const SuggestedChangeSchema = z.object({
  kind: z.enum(["css", "dom", "component", "file", "other"]),
  target: z.string(),
  detail: z.string(),
});
export type SuggestedChange = z.infer<typeof SuggestedChangeSchema>;

export const AgentTaskSchema = z.object({
  summary: z.string(),
  intent: TaskIntentSchema,
  acceptance_criteria: z.array(z.string()),
  suggested_changes: z.array(SuggestedChangeSchema),
  confidence: z.number().min(0).max(1),
  assumptions: z.array(z.string()),
});
export type AgentTask = z.infer<typeof AgentTaskSchema>;

export const StyleDiffEntrySchema = z.object({
  property: z.string(),
  before: z.string().nullable(),
  after: z.string().nullable(),
  passed: z.boolean().optional(),
});
export type StyleDiffEntry = z.infer<typeof StyleDiffEntrySchema>;

export const StyleDiffSchema = z.object({
  taskId: z.string(),
  entries: z.array(StyleDiffEntrySchema),
  elementFound: z.boolean(),
  message: z.string().optional(),
});
export type StyleDiff = z.infer<typeof StyleDiffSchema>;

export const TaskRecordSchema = z.object({
  id: z.string(),
  status: TaskStatusSchema,
  comment: z.string(),
  capture: ElementCaptureSchema,
  agentTask: AgentTaskSchema.nullable(),
  styleDiff: StyleDiffSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type TaskRecord = z.infer<typeof TaskRecordSchema>;
