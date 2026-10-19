import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type DeferredSectionProps = {
  children: ReactNode;
  /** Reserved height reduces CLS while chunk loads */
  minHeight?: number;
  className?: string;
  rootMargin?: string;
};

/**
 * Defers mounting (and lazy chunk fetch) until the section nears the viewport.
 */
export function DeferredSection({
  children,
  minHeight = 320,
  className,
  rootMargin = "280px 0px",
}: DeferredSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <section
      ref={ref}
      className={cn("deferred-section", className)}
      style={{ minHeight: visible ? undefined : minHeight }}
    >
      {visible ? children : null}
    </section>
  );
}
