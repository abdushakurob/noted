import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type MouseEvent } from "react";

type RequestItem = {
  id: string;
  label: string;
  tag: string;
  note: string;
  width: number;
  height: number;
  onScreen: boolean;
  at: number;
};

const STORAGE_KEY = "noted-demo-requests";

function elementKind(tag: string) {
  if (tag === "a") return "Link";
  if (tag === "button") return "Button";
  if (tag === "h1" || tag === "h2") return "Heading";
  if (tag === "p") return "Text";
  return tag;
}

function writeLocalTask(item: Pick<RequestItem, "label" | "note" | "width" | "height" | "onScreen">) {
  const facts: string[] = [];
  if (item.height < 44) {
    facts.push(`Make “${item.label}” at least 44px tall. It is ${item.height}px, which is hard to tap.`);
  }
  if (!item.onScreen) {
    facts.push(`Bring “${item.label}” onto the screen so it is visible without scrolling.`);
  }
  if (facts.length) return facts.join(" ");
  const place = item.onScreen ? "on screen" : "below the fold";
  return `“${item.label}” is ${item.width}×${item.height}px and ${place}. ${item.note}`;
}

function loadRequests(): RequestItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RequestItem[];
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch {
    return [];
  }
}

export function DemoPage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState<RequestItem[]>(() => loadRequests());
  const [picking, setPicking] = useState(() => loadRequests().length === 0);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [note, setNote] = useState("");
  const [activeId, setActiveId] = useState<string | null>(() => loadRequests()[0]?.id ?? null);

  useEffect(() => {
    document.title = "Try note’d";
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !target) return;
    const place = () => {
      const a = target.getBoundingClientRect();
      const b = stage.getBoundingClientRect();
      setBox({
        top: a.top - b.top + stage.scrollTop,
        left: a.left - b.left + stage.scrollLeft,
        width: a.width,
        height: a.height,
      });
    };
    place();
    stage.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      stage.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [target]);

  function onStageClick(event: MouseEvent<HTMLDivElement>) {
    if (!picking) return;
    const node = event.target as HTMLElement | null;
    if (!node || node.closest("[data-demo-chrome]")) return;
    event.preventDefault();
    event.stopPropagation();
    setTarget(node);
    setNote("");
    setActiveId(null);
    setPicking(false);
  }

  function save() {
    if (!target || !note.trim()) return;
    const rect = target.getBoundingClientRect();
    const label = (target.innerText || target.getAttribute("aria-label") || target.tagName).trim().slice(0, 80);
    const item: RequestItem = {
      id: crypto.randomUUID(),
      label,
      tag: target.tagName.toLowerCase(),
      note: note.trim(),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      onScreen: rect.top >= 0 && rect.bottom <= window.innerHeight,
      at: Date.now(),
    };
    setRequests((prev) => [item, ...prev].slice(0, 12));
    setActiveId(item.id);
    setNote("");
    setTarget(null);
    setBox(null);
  }

  const active = requests.find((item) => item.id === activeId) ?? null;
  const targetLabel = target
    ? (target.innerText || target.getAttribute("aria-label") || target.tagName).trim().slice(0, 80)
    : "";

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header
        data-demo-chrome
        className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6"
      >
        <div className="flex items-center gap-4">
          <a href="/" className="text-[15px] font-medium tracking-[-0.03em]">
            note&apos;d
          </a>
          <span className="hidden text-sm text-muted-foreground sm:inline">On this computer</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className={cn(buttonVariants({ variant: picking ? "accent" : "outline", size: "sm" }))}
            onClick={() => {
              setPicking((on) => !on);
              if (picking) {
                setTarget(null);
                setBox(null);
              }
            }}
          >
            {picking ? "Click something on the page" : "Select again"}
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div
          ref={stageRef}
          onClick={onStageClick}
          className={cn("relative overflow-auto", picking && "cursor-crosshair")}
        >
          <SampleApp />
          {box ? (
            <div
              aria-hidden
              className="pointer-events-none absolute rounded-md ring-2 ring-primary"
              style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
            />
          ) : null}
        </div>

        <aside data-demo-chrome className="flex min-h-0 flex-col border-t border-border bg-card lg:border-t-0 lg:border-l">
          <div className="border-b border-border px-5 py-4">
            <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">On this computer</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {picking
                ? "Click Upgrade. The size is read on this page. You say what should change. Both stay here."
                : target
                  ? `“${targetLabel}” is measured here. Say what should change. An open model on this computer writes the task from those two.`
                  : "The page, the measurement, and the task stay on this computer."}
            </p>
          </div>

          {target ? (
            <form
              className="flex flex-col gap-3 border-b border-border px-5 py-4"
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
            >
              <p className="text-sm text-foreground">
                {elementKind(target.tagName.toLowerCase())} · {Math.round(target.getBoundingClientRect().width)}×
                {Math.round(target.getBoundingClientRect().height)}px
              </p>
              <label className="text-sm text-foreground" htmlFor="demo-note">
                What should change?
              </label>
              <textarea
                id="demo-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder="The upgrade button is too small on a phone."
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button type="submit" className={cn(buttonVariants({ variant: "accent" }))} disabled={!note.trim()}>
                Write the task here
              </button>
            </form>
          ) : null}

          {active ? (
            <div className="border-b border-border px-5 py-4">
              <p className="text-sm leading-6 text-foreground">“{active.note}”</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {elementKind(active.tag)} · {active.width}×{active.height}px ·{" "}
                {active.onScreen ? "On screen" : "Below the fold"}
              </p>
              <p className="mt-8 text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Where an open model fits
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your note is a sentence. The measurement is a fact. An open model on this computer reads them
                together and writes a task. That is the step a model is for, and it happens here.
              </p>
              <p className="mt-4 text-lg leading-7 tracking-[-0.03em] text-foreground">{writeLocalTask(active)}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                This preview writes that from the measurement. On your machine, an open model does the writing.
                Cursor then reads the task from this computer.
              </p>
            </div>
          ) : null}

          <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests yet.</p>
            ) : (
              <ul className="flex flex-col">
                {requests.map((item) => (
                  <li key={item.id} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      className="w-full py-3 text-left"
                      onClick={() => {
                        setActiveId(item.id);
                        setTarget(null);
                        setBox(null);
                        setPicking(false);
                      }}
                    >
                      <span className="block text-sm text-foreground">{item.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{item.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function SampleApp() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8">
      <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">Northline</p>
      <h1 className="mt-3 max-w-[16ch] text-[2.25rem] text-foreground">Membership for the studio.</h1>
      <p className="mt-4 max-w-[46ch] text-[15px] leading-7 text-muted-foreground">
        A sample page, so you can leave a request the way a client would. Nothing here is your real product.
      </p>
      <div className="mt-10 flex items-end justify-between gap-6 border-t border-border pt-8">
        <div>
          <p className="text-sm text-muted-foreground">Studio plan</p>
          <p className="mt-1 text-4xl tracking-[-0.03em] text-foreground">$29</p>
          <p className="mt-1 text-sm text-muted-foreground">per month, billed yearly</p>
        </div>
        <a
          href="#upgrade"
          onClick={(event) => event.preventDefault()}
          className="inline-flex h-8 items-center rounded-full bg-foreground px-3 text-xs text-background"
        >
          Upgrade
        </a>
      </div>
      <ul className="mt-10 divide-y divide-border border-y border-border text-sm">
        <li className="flex justify-between py-4">
          <span>Shared previews</span>
          <span className="text-muted-foreground">3 teammates</span>
        </li>
        <li className="flex justify-between py-4">
          <span>Review history</span>
          <span className="text-muted-foreground">14 days</span>
        </li>
        <li className="flex justify-between py-4">
          <span>Agent handoff</span>
          <span className="text-muted-foreground">Cursor</span>
        </li>
      </ul>
    </div>
  );
}
