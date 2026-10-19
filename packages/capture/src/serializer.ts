import { inspectReact } from "@noted/react-inspect";
import type { DomNode, ElementCapture } from "@noted/shared";
import { contrastRatio, STYLE_KEYS, truncateJson } from "@noted/shared";
import { inspectVue } from "@noted/vue-inspect";

const DOM_DEPTH = 3;
const DATA_ATTR = "data-noted-id";

const STYLE_PROPS = STYLE_KEYS as unknown as string[];

function simpleHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

function selectorPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.nodeType === 1 && parts.length < 6) {
    let part = node.tagName.toLowerCase();
    if (node.id) {
      part += `#${node.id}`;
      parts.unshift(part);
      break;
    }
    const cls = node.classList?.[0];
    if (cls) part += `.${cls}`;
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

function redactText(el: Element, text: string): string {
  if (el instanceof HTMLInputElement) {
    if (el.type === "password") return "[redacted]";
    if (el.type === "email" || el.type === "tel") return "[redacted]";
  }
  return text.length > 120 ? text.slice(0, 120) + "…" : text;
}

function serializeDom(el: Element, depth: number): DomNode {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role") ?? undefined;
  const id = el.id || undefined;
  const classes = el.classList.length ? [...el.classList] : undefined;
  const attributes: Record<string, string> = {};
  for (const attr of el.attributes) {
    if (attr.name === "class" || attr.name === "style") continue;
    if (attr.name.startsWith("data-noted")) continue;
    attributes[attr.name] = attr.value.slice(0, 80);
  }
  let text: string | undefined;
  if (el.childNodes.length === 1 && el.childNodes[0]?.nodeType === 3) {
    text = redactText(el, el.textContent?.trim() ?? "");
  }
  const node: DomNode = { tag, role, id, classes, attributes, text };
  if (depth > 0) {
    const children: DomNode[] = [];
    for (const child of el.children) {
      if (children.length >= 8) {
        node.truncated = true;
        break;
      }
      children.push(serializeDom(child, depth - 1));
    }
    if (children.length) node.children = children;
  }
  return node;
}

function breakpointLabel(width: number): string {
  if (width < 640) return "sm";
  if (width < 768) return "md";
  if (width < 1024) return "lg";
  if (width < 1280) return "xl";
  return "2xl";
}

function accName(el: Element): string | undefined {
  const labelled = el.getAttribute("aria-label");
  if (labelled) return labelled.slice(0, 120);
  if (el instanceof HTMLInputElement && el.labels?.[0]) {
    return el.labels[0].textContent?.trim().slice(0, 120);
  }
  const text = el.textContent?.trim();
  return text ? text.slice(0, 80) : undefined;
}

function landmarkChain(el: Element): string[] {
  const chain: string[] = [];
  let node: Element | null = el;
  while (node && chain.length < 5) {
    const role = node.getAttribute("role");
    const tag = node.tagName.toLowerCase();
    if (role === "main" || role === "navigation" || tag === "main" || tag === "nav") {
      chain.unshift(role ?? tag);
    }
    node = node.parentElement;
  }
  return chain;
}

function readStyles(el: Element): Record<string, string> {
  const computed = getComputedStyle(el);
  const styles: Record<string, string> = {};
  for (const key of STYLE_PROPS) {
    styles[key] = computed.getPropertyValue(key);
  }
  return styles;
}

function mergeFramework(el: Element) {
  const react = inspectReact(el);
  if (react.componentStack.length) return react;
  return inspectVue(el);
}

export function captureElement(el: Element): ElementCapture {
  const existing = el.getAttribute(DATA_ATTR);
  const notedId = existing ?? crypto.randomUUID();
  if (!existing) el.setAttribute(DATA_ATTR, notedId);

  const styles = readStyles(el);
  const fg = styles.color ?? "rgb(0,0,0)";
  const bg = styles["background-color"] ?? "rgb(255,255,255)";
  const ratio = contrastRatio(fg, bg);

  const rect = el.getBoundingClientRect();
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const aboveFold = rect.bottom > 0 && rect.top < vh;
  const belowFold = rect.top > vh;

  const textHint = el.textContent?.trim().slice(0, 40) ?? "";
  const fingerprint = simpleHash(`${selectorPath(el)}|${el.tagName}|${textHint}`);

  const raw: ElementCapture = {
    notedId,
    fingerprint,
    selectorPath: selectorPath(el),
    page: {
      url: location.href,
      path: location.pathname,
      title: document.title.slice(0, 200),
    },
    dom: serializeDom(el, DOM_DEPTH),
    layout: {
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
      },
      scrollY,
      aboveFold,
      belowFold,
      viewportWidth: window.innerWidth,
      viewportHeight: vh,
      breakpoint: breakpointLabel(window.innerWidth),
      tapTargetPx: Math.min(rect.width, rect.height),
    },
    styles,
    contrastRatio: ratio,
    a11y: {
      role: el.getAttribute("role") ?? undefined,
      name: accName(el),
      focusable: el.matches("a,button,input,select,textarea,[tabindex]"),
      tabIndex: el.hasAttribute("tabindex") ? Number(el.getAttribute("tabindex")) : undefined,
      landmarkChain: landmarkChain(el),
    },
    consoleErrors: [],
    failedRequests: [],
    framework: mergeFramework(el),
    capturedAt: new Date().toISOString(),
  };

  const { value, truncated } = truncateJson(raw);
  if (truncated) value.truncated = true;
  return value;
}

export function findByNotedId(notedId: string): Element | null {
  return document.querySelector(`[${DATA_ATTR}="${CSS.escape(notedId)}"]`);
}
