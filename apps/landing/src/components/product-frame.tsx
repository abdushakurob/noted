export function ProductFrame() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-border bg-[#f4f1ea] shadow-[0_30px_80px_-36px_oklch(0_0_0_/_0.45)] dark:bg-[#1c1a17]">
      <div className="flex items-center gap-3 border-b border-black/10 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-black/20">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#e7e1d8]" />
          <span className="size-2.5 rounded-full bg-[#e7e1d8]" />
          <span className="size-2.5 rounded-full bg-[#e7e1d8]" />
        </span>
        <p className="min-w-0 flex-1 truncate rounded-full bg-black/5 px-3 py-1 text-xs text-black/55 dark:bg-white/10 dark:text-white/60">
          localhost:5180/order
        </p>
        <p className="hidden text-xs text-black/50 sm:block dark:text-white/50">Live preview on</p>
      </div>

      <div className="relative grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_280px] lg:items-start">
        <div>
          <p className="text-xs tracking-[0.14em] text-[#8a8175] uppercase">Sweet Crumb</p>
          <p className="mt-3 max-w-[16ch] font-sans text-[2rem] leading-[1.05] tracking-[-0.03em] text-[#1c1916] dark:text-[#f6f1e8]">
            Fresh bread, every morning
          </p>
          <p className="mt-3 max-w-[28ch] text-sm leading-6 text-[#6d655c] dark:text-[#c9c0b4]">
            Order online for pickup. The button below is what a reviewer just selected.
          </p>
          <div className="relative mt-8 inline-block">
            <span
              className="pointer-events-none absolute -inset-2 rounded-xl border-2 border-[#1c1916] dark:border-[#f6f1e8]"
              aria-hidden
            />
            <span className="relative inline-flex h-8 items-center rounded-md bg-[#c4a574] px-3 text-[13px] text-[#f6f1e8]">
              Order now
            </span>
          </div>
        </div>

        <aside className="rounded-2xl bg-white p-4 text-[#1c1916] shadow-[0_16px_40px_-24px_oklch(0_0_0_/_0.45)]">
          <p className="text-[11px] tracking-[0.08em] text-black/45 uppercase">Selected</p>
          <p className="mt-2 text-sm leading-6">
            Too small on a phone. Make it easier to find without scrolling.
          </p>
          <dl className="mt-4 space-y-2 text-xs text-black/55">
            <div className="flex justify-between gap-3">
              <dt>Height</dt>
              <dd className="text-black/80">32px</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>On screen</dt>
              <dd className="text-black/80">Below the fold</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Sent to</dt>
              <dd className="text-black/80">Cursor</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
