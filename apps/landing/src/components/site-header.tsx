import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { DEMO_PATH } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const links = [
  { href: "#workspace", label: "Product" },
  { href: "#solutions", label: "Solutions" },
  { href: "#developers", label: "Developers" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "Resources" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#" className="text-[15px] font-medium tracking-[-0.03em]">
          note&apos;d
        </a>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-foreground/75 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={DEMO_PATH} className="hidden text-sm text-foreground/80 hover:text-foreground sm:inline">
            Try demo
          </a>
          <a
            href={DEMO_PATH}
            className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
          >
            Start for free
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
