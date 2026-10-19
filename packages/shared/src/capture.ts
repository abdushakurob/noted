import { z } from "zod";

export const DomNodeSchema: z.ZodType<DomNode> = z.lazy(() =>
  z.object({
    tag: z.string(),
    role: z.string().optional(),
    id: z.string().optional(),
    classes: z.array(z.string()).optional(),
    attributes: z.record(z.string()).optional(),
    text: z.string().optional(),
    truncated: z.boolean().optional(),
    children: z.array(DomNodeSchema).optional(),
  }),
);
export type DomNode = {
  tag: string;
  role?: string;
  id?: string;
  classes?: string[];
  attributes?: Record<string, string>;
  text?: string;
  truncated?: boolean;
  children?: DomNode[];
};

export const LayoutInfoSchema = z.object({
  rect: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    top: z.number(),
    left: z.number(),
    bottom: z.number(),
    right: z.number(),
  }),
  scrollY: z.number(),
  aboveFold: z.boolean(),
  belowFold: z.boolean(),
  viewportWidth: z.number(),
  viewportHeight: z.number(),
  breakpoint: z.string(),
  tapTargetPx: z.number(),
});
export type LayoutInfo = z.infer<typeof LayoutInfoSchema>;

export const ComputedStylesSchema = z.record(z.string());
export type ComputedStyles = z.infer<typeof ComputedStylesSchema>;

export const A11yInfoSchema = z.object({
  role: z.string().optional(),
  name: z.string().optional(),
  focusable: z.boolean(),
  tabIndex: z.number().optional(),
  landmarkChain: z.array(z.string()),
});
export type A11yInfo = z.infer<typeof A11yInfoSchema>;

export const ConsoleErrorSchema = z.object({
  message: z.string(),
  timestamp: z.number(),
});
export type ConsoleError = z.infer<typeof ConsoleErrorSchema>;

export const FailedRequestSchema = z.object({
  url: z.string(),
  status: z.number().optional(),
  method: z.string().optional(),
  timestamp: z.number(),
});
export type FailedRequest = z.infer<typeof FailedRequestSchema>;

export const ComponentSourceSchema = z.object({
  fileName: z.string().optional(),
  lineNumber: z.number().optional(),
  columnNumber: z.number().optional(),
});
export type ComponentSource = z.infer<typeof ComponentSourceSchema>;

export const FrameworkComponentSchema = z.object({
  name: z.string(),
  source: ComponentSourceSchema.optional(),
  props: z.record(z.unknown()).optional(),
});
export type FrameworkComponent = z.infer<typeof FrameworkComponentSchema>;

export const FrameworkContextSchema = z.object({
  framework: z.enum(["react", "vue", "unknown"]),
  componentStack: z.array(FrameworkComponentSchema),
});
export type FrameworkContext = z.infer<typeof FrameworkContextSchema>;

export const PageContextSchema = z.object({
  url: z.string(),
  path: z.string(),
  title: z.string(),
});
export type PageContext = z.infer<typeof PageContextSchema>;

export const ElementCaptureSchema = z.object({
  notedId: z.string(),
  fingerprint: z.string(),
  selectorPath: z.string(),
  page: PageContextSchema,
  dom: DomNodeSchema,
  layout: LayoutInfoSchema,
  styles: ComputedStylesSchema,
  contrastRatio: z.number().nullable(),
  a11y: A11yInfoSchema,
  consoleErrors: z.array(ConsoleErrorSchema),
  failedRequests: z.array(FailedRequestSchema),
  framework: FrameworkContextSchema,
  capturedAt: z.string(),
  truncated: z.boolean().optional(),
});
export type ElementCapture = z.infer<typeof ElementCaptureSchema>;

export const CaptureSubmitSchema = z.object({
  capture: ElementCaptureSchema,
  comment: z.string().min(1),
});
export type CaptureSubmit = z.infer<typeof CaptureSubmitSchema>;
