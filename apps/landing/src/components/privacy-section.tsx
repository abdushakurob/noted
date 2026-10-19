export function PrivacySection() {
  return (
    <section
      id="privacy"
      className="scroll-mt-20 border-y border-border bg-muted/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Your client&apos;s work stays on your machine
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Unreleased pages and logged-in flows are sensitive. note&apos;d measures
          the page locally and writes the task locally. You can optionally use free
          AI on your own computer to draft the write-up — nothing has to go through
          a cloud photo model.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Open source. You can read exactly what it stores.
        </p>
      </div>
    </section>
  );
}
