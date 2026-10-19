import { GITHUB_URL } from "@/lib/site-config";

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="text-[1.75rem] text-foreground sm:text-[2rem]">Pricing</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-5 sm:grid-cols-[160px_80px_1fr] sm:items-baseline sm:gap-8">
            <p className="text-sm font-medium">On your computer</p>
            <p className="text-sm tabular-nums">$0</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Capture, inbox, and Cursor. Open source.
            </p>
          </div>
          <div className="grid gap-2 py-5 sm:grid-cols-[160px_80px_1fr] sm:items-baseline sm:gap-8">
            <p className="text-sm font-medium">Client link</p>
            <p className="text-sm text-muted-foreground">Later</p>
            <p className="text-sm leading-6 text-muted-foreground">
              A page you can send instead of hopping on a call. Not available yet.
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Setup is in the repo:{" "}
          <a
            href={GITHUB_URL}
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            target="_blank"
            rel="noreferrer"
          >
            get the code
          </a>
          . The written steps are in <span className="text-foreground">docs/USER-GUIDE.md</span>.
        </p>
      </div>
    </section>
  );
}
