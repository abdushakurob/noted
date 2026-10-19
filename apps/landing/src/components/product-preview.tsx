export function ProductPreview() {
  return (
    <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-24px_oklch(0_0_0_/_0.12)] dark:shadow-[0_24px_80px_-24px_oklch(0_0_0_/_0.5)]">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-border p-8 lg:border-r lg:border-b-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What your client said
              </p>
              <p className="mt-3 text-xl font-medium text-foreground">
                &ldquo;The order button is too small — I almost missed it on my
                phone.&rdquo;
              </p>
              <p className="mt-6 text-sm text-muted-foreground">
                Picked element: <span className="text-foreground">Order now</span>
              </p>
            </div>
            <div className="bg-muted/30 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What you hand to Cursor
              </p>
              <ul className="mt-4 space-y-3 text-[15px] text-foreground">
                <li>Increase tap target to at least 48px tall</li>
                <li>Improve contrast so the label is easy to read</li>
                <li>Keep visible without scrolling on a phone-width layout</li>
              </ul>
              <p className="mt-6 text-sm text-primary font-medium">
                You approve before anything hits your editor.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Example from the included bakery demo site — swap in your client&apos;s
          project the same way.
        </p>
      </div>
    </section>
  );
}
