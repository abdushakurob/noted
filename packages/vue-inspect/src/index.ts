import type { FrameworkComponent, FrameworkContext } from "@noted/shared";

const MAX_PROPS = 12;
const MAX_STACK = 8;

function safeProps(raw: Record<string, unknown> | null | undefined): Record<string, unknown> | undefined {
  if (!raw) return undefined;
  const out: Record<string, unknown> = {};
  let count = 0;
  for (const key of Object.keys(raw)) {
    if (count >= MAX_PROPS) break;
    const val = raw[key];
    const t = typeof val;
    if (t === "string" || t === "number" || t === "boolean" || val === null) {
      out[key] = val;
      count++;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

type VueInstance = {
  type?: { name?: string; __name?: string; __file?: string };
  parent?: VueInstance | null;
  props?: Record<string, unknown>;
};

export function inspectVue(element: Element): FrameworkContext {
  const el = element as unknown as { __vueParentComponent?: VueInstance };
  let instance = el.__vueParentComponent;
  if (!instance) {
    return { framework: "unknown", componentStack: [] };
  }

  const stack: FrameworkComponent[] = [];
  while (instance != null && stack.length < MAX_STACK) {
    const type = instance.type;
    const name = type?.__name ?? type?.name ?? "Component";
    stack.push({
      name,
      source: type?.__file ? { fileName: type.__file } : undefined,
      props: safeProps(instance.props),
    });
    instance = instance.parent ?? undefined;
  }

  return { framework: "vue", componentStack: stack };
}
