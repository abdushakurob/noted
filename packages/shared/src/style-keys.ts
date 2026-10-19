/** Whitelist for capture + diff — keeps payloads small and comparisons fast. */
export const STYLE_KEYS = [
  "height",
  "width",
  "min-height",
  "min-width",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "font-size",
  "font-weight",
  "font-family",
  "color",
  "background-color",
  "display",
  "position",
  "overflow",
  "opacity",
  "z-index",
  "line-height",
] as const;

export type StyleKey = (typeof STYLE_KEYS)[number];
