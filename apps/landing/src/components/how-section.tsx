export function HowSection() {
  const steps = [
    {
      n: "1",
      title: "Capture on their site",
      body: "Open their staging URL, click the element, type what they asked for. Takes seconds on a call.",
    },
    {
      n: "2",
      title: "Review in your inbox",
      body: "See the suggested task in plain English. Edit if you need to, then approve when it’s right.",
    },
    {
      n: "3",
      title: "Fix in Cursor",
      body: "Pull the approved task into your workflow, ship the change, and mark it done with a before/after check.",
    },
  ];

  return (
    <section id="how" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <div className="mx-auto max-w-[520px] text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Three steps. Same call or async.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Runs on your laptop today. A shareable link for clients who won&apos;t
            install anything is coming later.
          </p>
        </div>
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative pl-14 md:pl-0 md:pt-14">
              <span
                className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground md:static md:mb-5"
                aria-hidden
              >
                {s.n}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
