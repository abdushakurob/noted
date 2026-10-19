const steps = [
  {
    title: "On their site",
    body: "Open the page, click the control, and write the note in their words.",
  },
  {
    title: "In your inbox",
    body: "Read the task. Change a line if you need to. Approve it before it leaves.",
  },
  {
    title: "In Cursor",
    body: "Open the approved task and make the change. Check the page when you’re done.",
  },
];

export function FlowSection() {
  return (
    <section id="product" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-[18ch] text-[1.75rem] text-foreground sm:text-[2rem]">
          One note. One task. Then the edit.
        </h2>
        <ol className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-3 md:gap-10">
          {steps.map((step) => (
            <li key={step.title}>
              <h3 className="text-sm font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-[36ch] text-sm leading-6 text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
