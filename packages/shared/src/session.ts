import { z } from "zod";

/** Phase 2: client review sessions (types only in v0). */
export const ParticipantRoleSchema = z.enum(["freelancer", "client"]);
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;

export const ReviewSessionSchema = z.object({
  id: z.string(),
  expiry: z.string(),
  revokeToken: z.string(),
  allowedOrigin: z.string(),
  brandingSlug: z.string().optional(),
  createdAt: z.string(),
});
export type ReviewSession = z.infer<typeof ReviewSessionSchema>;
