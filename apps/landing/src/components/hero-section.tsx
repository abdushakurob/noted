import { ProductFrame } from "@/components/product-frame";
import { buttonVariants } from "@/components/ui/button";
import { DOCS_PATH } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[760px] px-5 pt-20 pb-12 text-center sm:px-8 sm:pt-28">
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          The connected development workspace
        </p>
        <h1 className="mt-5 text-balance text-[2.75rem] text-foreground sm:text-[4rem]">
          Everything you need to build better, together.
        </h1>
        <p className="mx-auto mt-6 max-w-[42rem] text-pretty text-lg leading-8 text-muted-foreground">
          Bring your browser, coding agents, and team into one powerful development
          workspace.
        </p>
        <p className="mx-auto mt-4 max-w-[40rem] text-pretty text-[15px] leading-7 text-muted-foreground">
          Build directly from your running application, share your localhost with
          the world, and turn every piece of feedback into meaningful progress.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={`${DOCS_PATH}/install`} className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
            Start building for free
            <span aria-hidden>→</span>
          </a>
          <a href="/docs" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Read the docs
          </a>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Works with Claude Code, Cursor, Codex, and your favorite development tools.
        </p>
      </div>
      <div className="mx-auto max-w-[1040px] px-5 pb-16 sm:px-8">
        <ProductFrame />
      </div>
    </section>
  );
}
