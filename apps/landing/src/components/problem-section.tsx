export function ProblemSection() {
  return (
    <section id="story" className="scroll-mt-20 border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Revision calls shouldn&apos;t end in a vague Slack thread
            </h2>
            <p className="mt-4 text-muted-foreground">
              Clients describe what they see, not what to change. You rebuild context
              from memory, hunt the right element, and hope the invoice matches the
              work.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "“Make it pop” — but pop how?",
              "Screenshots with no measurements",
              "No paper trail when scope creeps",
            ].map((line) => (
              <li
                key={line}
                className="rounded-xl border border-border bg-card px-5 py-4 text-[15px] text-foreground shadow-sm"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="mx-auto mt-16 max-w-[560px] text-center text-lg font-medium text-foreground">
          note&apos;d records what was wrong on the page, turns the comment into a
          clear task, and keeps a log on your computer.
        </p>
      </div>
    </section>
  );
}
