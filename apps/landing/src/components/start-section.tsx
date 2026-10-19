import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function StartSection() {
  return (
    <section id="start" className="scroll-mt-20 border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-[640px] px-5 text-center sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Try it on the demo in about five minutes
        </h2>
        <p className="mt-4 text-muted-foreground">
          Clone the repo, run the local server and demo site, capture the bakery
          button, approve the task, and connect Cursor once. Step-by-step guide in{" "}
          <span className="text-foreground">docs/USER-GUIDE.md</span>.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <a
            href={GITHUB_URL}
            className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
            target="_blank"
            rel="noreferrer"
          >
            Get the code
          </a>
          <a
            href="#pricing"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            See pricing
          </a>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          No account · no browser extension · Node on your computer
        </p>
      </div>
    </section>
  );
}
