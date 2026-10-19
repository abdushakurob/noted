import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { DEMO_PATH } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function Band({
  id,
  children,
  muted = false,
}: {
  id?: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 border-b border-border",
        muted && "bg-muted/50",
      )}
    >
      <div className="mx-auto max-w-[1040px] px-5 py-20 sm:px-8 sm:py-24">{children}</div>
    </section>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function StoryBand() {
  return (
    <Band id="workspace">
      <div className="mx-auto max-w-[720px]">
        <Kicker>A new way to experience development</Kicker>
        <h2 className="mt-4 text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
          Your entire development workflow, beautifully connected.
        </h2>
        <div className="mt-6 space-y-4 text-[15px] leading-7 text-muted-foreground">
          <p>
            Great software takes more than code. It takes ideas, collaboration,
            feedback, and continuous improvement.
          </p>
          <p>
            note’d brings everything together in a seamless workspace where
            developers can build with AI, collaborate with their teams, and move
            from ideas to implementation.
          </p>
          <p className="text-foreground">
            One connected experience, from your first line of code to your next big release.
          </p>
        </div>
      </div>
    </Band>
  );
}

export function BuildBand() {
  return (
    <Band id="developers">
      <Kicker>Build at the speed of thought</Kicker>
      <div className="mt-12 grid gap-16 lg:grid-cols-2">
        <article>
          <h2 className="text-[1.75rem] text-foreground sm:text-[2rem]">
            Your application is your workspace.
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
            See something worth changing? Make it happen right where you see it.
          </p>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            Select any element in your running application, describe what you want,
            and send it directly to your coding agent.
          </p>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            Refine layouts, improve interactions, investigate issues, and iterate
            on features without leaving your browser.
          </p>
          <p className="mt-4 text-[15px] text-foreground">
            Your agent gets the context. You stay in flow.
          </p>
          <a href="/docs" className="mt-6 inline-flex text-sm font-medium underline decoration-border underline-offset-4">
            Read the setup →
          </a>
        </article>
        <article id="agents">
          <h2 className="text-[1.75rem] text-foreground sm:text-[2rem]">
            Your AI coding agents, one connected workflow.
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
            Work with the tools you already trust.
          </p>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            note’d brings your coding agents into your browser through MCP-powered
            integrations, letting you communicate instructions, manage requests, and
            follow development progress.
          </p>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            Whether you&apos;re building with Claude Code, Cursor, Codex, or other
            supported agents, your workflow stays connected.
          </p>
          <a href="/docs#cursor" className="mt-6 inline-flex text-sm font-medium underline decoration-border underline-offset-4">
            How Cursor connects →
          </a>
        </article>
      </div>
    </Band>
  );
}

const shareUses = [
  ["Live demos", "Show your latest work to anyone, anywhere."],
  ["Team stand-ups", "Walk through features together and capture decisions as they happen."],
  ["Client reviews", "Invite clients into your work and collect feedback directly."],
  ["Quality assurance", "Let testers explore your application and report issues with context."],
  ["Real-time iteration", "Make changes locally and let reviewers see the latest version through the same link."],
];

export function ShareBand() {
  return (
    <Band id="share" muted>
      <div className="max-w-[720px]">
        <h2 className="text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
          Your localhost deserves an audience.
        </h2>
        <h3 className="mt-6 text-[1.35rem] text-foreground">
          Share what you&apos;re building, as you&apos;re building it.
        </h3>
        <div className="mt-4 space-y-3 text-[15px] leading-7 text-muted-foreground">
          <p>
            Turn any locally running web application into a secure, shareable
            development experience.
          </p>
          <p>
            Create a live preview link, invite collaborators, and let them explore
            your application directly from their browsers.
          </p>
          <p>
            Perfect for product reviews, stand-ups, client presentations, testing
            sessions, and everything in between.
          </p>
          <p className="text-foreground">
            Your application stays on your machine. Your team stays connected.
          </p>
        </div>
        <a href="/#pricing" className="mt-6 inline-flex text-sm font-medium underline decoration-border underline-offset-4">
          See the proposal →
        </a>
      </div>
      <div className="mt-16 overflow-hidden rounded-[28px] border border-border bg-background">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <p className="text-sm text-foreground">preview.noted.app/sweet-crumb</p>
          <p className="text-xs text-muted-foreground">Same link · latest local build</p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
          {shareUses.map(([title, body], index) => (
            <li
              key={title}
              className={cn(
                "px-5 py-6",
                index === 0 && "sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:py-10",
              )}
            >
              <p className={cn("text-foreground", index === 0 ? "text-2xl" : "text-base")}>{title}</p>
              <p className="mt-2 max-w-[28ch] text-sm leading-6 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Band>
  );
}

const loop = [
  ["Capture", "Collect feedback directly from your running application."],
  ["Understand", "Bring together visual evidence, browser details, and the original observation."],
  ["Act", "Assign requests to developers or connected AI coding agents."],
  ["Review", "Follow progress and verify changes in the same application."],
  ["Resolve", "Keep a clear history of what changed and what's complete."],
];

export function FeedbackBand() {
  return (
    <Band>
      <div className="max-w-[720px]">
        <h2 className="text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
          Feedback that builds better software.
        </h2>
        <h3 className="mt-6 text-[1.35rem] text-foreground">
          Turn every observation into progress.
        </h3>
        <div className="mt-4 space-y-3 text-[15px] leading-7 text-muted-foreground">
          <p>Great feedback is specific, actionable, and easy to understand.</p>
          <p>note’d makes it effortless for anyone to communicate what they see in your application.</p>
          <p>
            Reviewers can select elements, report unexpected behavior, and suggest
            improvements while note’d automatically preserves the surrounding context.
          </p>
          <p>
            Every request arrives with the details needed to understand it, investigate
            it, and move forward.
          </p>
        </div>
      </div>
      <ol className="mt-16 space-y-0">
        {loop.map(([title, body], i) => (
          <li key={title} className="grid gap-3 border-t border-border py-8 sm:grid-cols-[180px_1fr] sm:items-baseline">
            <p className="text-[1.75rem] tracking-[-0.03em] text-foreground">
              <span className="mr-3 text-sm text-muted-foreground">0{i + 1}</span>
              {title}
            </p>
            <p className="max-w-[46ch] text-[15px] leading-7 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-foreground">Everything connected. Everyone moving forward.</p>
    </Band>
  );
}

const audiences = [
  ["For developers", "Build, debug, and refine applications directly from the browser with AI-powered workflows."],
  ["For engineering teams", "Connect development, testing, and reviews across projects and contributors."],
  ["For freelancers", "Share work in progress, collaborate with clients, and turn feedback into changes."],
  ["For agencies", "Manage multiple projects, invite stakeholders, and keep delivery moving."],
  ["For testers", "Report issues with precise context and easily revisit changes for verification."],
];

export function TogetherBand() {
  return (
    <Band id="solutions" muted>
      <div className="max-w-[720px]">
        <h2 className="text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
          Better together, from anywhere.
        </h2>
        <h3 className="mt-6 text-[1.35rem] text-foreground">
          One workspace for everyone building your product.
        </h3>
        <div className="mt-4 space-y-3 text-[15px] leading-7 text-muted-foreground">
          <p>Bring developers, designers, testers, and clients into the same development experience.</p>
          <p>
            Create shared project workspaces, invite collaborators, manage feedback,
            and keep development activity connected to the software itself.
          </p>
          <p className="text-foreground">
            Every contributor sees what matters to them. Every request has the context it needs.
          </p>
        </div>
      </div>
      <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-6">
        {audiences.map(([title, body], index) => (
          <li key={title} className={index === 0 ? "sm:col-span-6" : "sm:col-span-3"}>
            <p className={index === 0 ? "text-[2rem] tracking-[-0.03em] text-foreground" : "text-lg text-foreground"}>
              {title.replace("For ", "")}
            </p>
            <p className="mt-2 max-w-[42ch] text-sm leading-6 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </Band>
  );
}

const contextItems = [
  "Selected elements and component information",
  "Page URLs and navigation context",
  "Screenshots and visual references",
  "Browser and viewport information",
  "Relevant interaction and diagnostic details",
  "Development requests and review history",
];

export function IntelligenceBand() {
  return (
    <Band>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <h2 className="text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
            Intelligence built into every interaction.
          </h2>
          <h3 className="mt-6 text-[1.35rem] text-foreground">Less explaining. More creating.</h3>
          <div className="mt-4 space-y-3 text-[15px] leading-7 text-muted-foreground">
            <p>note’d uses open-source AI to understand the context behind your development requests.</p>
            <p>
              From identifying relevant elements to organizing feedback and preparing
              instructions for coding agents, note’d brings clarity to the moments
              that move development forward.
            </p>
            <p>The result is a more natural way to communicate with your development tools.</p>
          </div>
        </div>
        <div>
          <h3 className="text-[1.35rem] text-foreground">Context, captured automatically.</h3>
          <ul className="mt-6 flex flex-wrap gap-2">
            {contextItems.map((item) => (
              <li
                key={item}
                className="max-w-[16rem] rounded-full bg-muted px-4 py-2 text-sm leading-6 text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[36ch] text-sm leading-6 text-muted-foreground">
            Everything your workflow needs, connected to the moment it happened.
          </p>
        </div>
      </div>
    </Band>
  );
}

const tools = [
  ["Browser-native controls", "Interact directly with the application you're building."],
  ["Secure localhost sharing", "Bring your development server online through managed preview links."],
  ["Agent connectivity", "Integrate with coding agents using MCP and supported developer tools."],
  ["Context intelligence", "Give agents the information they need to understand development requests."],
  ["Collaborative reviews", "Turn testing and feedback into a shared development experience."],
  ["Project workspaces", "Organize your applications, collaborators, and ongoing work."],
  ["Development activity", "Follow requests, agent actions, and review outcomes in one place."],
  ["Flexible integrations", "Connect note’d to your development stack and extend your workflow."],
];

export function ToolsBand() {
  return (
    <Band muted>
      <h2 className="max-w-[16ch] text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
        Built for developers. Designed for flow.
      </h2>
      <h3 className="mt-6 text-[1.35rem] text-foreground">Powerful tools. One effortless experience.</h3>
      <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map(([title, body], index) => (
          <li key={title} className={index < 2 ? "lg:col-span-2" : ""}>
            <p className={index < 2 ? "text-2xl tracking-[-0.03em] text-foreground" : "text-base text-foreground"}>
              {title}
            </p>
            <p className="mt-2 max-w-[36ch] text-sm leading-6 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </Band>
  );
}

const stack = ["Claude Code", "Cursor", "Codex", "MCP", "GitHub", "VS Code"];

export function StackBand() {
  return (
    <Band id="stack">
      <h2 className="text-[2rem] text-foreground sm:text-[2.75rem]">Your tools, better connected.</h2>
      <p className="mt-4 max-w-[40rem] text-[15px] leading-7 text-muted-foreground">
        Designed to work with your stack. From your favorite coding agents to the
        frameworks and tools powering your applications, note’d fits naturally into
        the way you build.
      </p>
      <ul className="mt-10 flex flex-wrap gap-2">
        {stack.map((name) => (
          <li
            key={name}
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground"
          >
            {name}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-foreground">Build with the tools you love, together in one workflow.</p>
    </Band>
  );
}

const stages = [
  ["01", "Build", "Connect your running application and preferred coding agent. Develop and refine features directly from the browser."],
  ["02", "Share", "Create a secure live preview and invite your teammates, clients, or testers."],
  ["03", "Collaborate", "Review the application together, collect feedback, and turn discussions into structured development requests."],
  ["04", "Improve", "Send requests to your coding agents, follow development activity, and review updated features."],
  ["05", "Ship", "Keep your team aligned as changes are completed and your product moves forward."],
];

export function StagesBand() {
  return (
    <Band muted>
      <h2 className="max-w-[18ch] text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
        One platform. Every stage of development.
      </h2>
      <p className="mt-4 text-[15px] text-muted-foreground">From the first preview to the final review.</p>
      <ol className="relative mt-14">
        <span className="absolute top-3 bottom-3 left-[15px] w-px bg-border" aria-hidden />
        {stages.map(([n, title, body]) => (
          <li key={n} className="relative pb-12 pl-14 last:pb-0">
            <span className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border border-border bg-background text-xs text-foreground">
              {n}
            </span>
            <p className="text-2xl tracking-[-0.03em] text-foreground">{title}</p>
            <p className="mt-2 max-w-[46ch] text-sm leading-6 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <a href={DEMO_PATH} className={cn(buttonVariants({ variant: "accent" }), "mt-4")}>
        Start building →
      </a>
    </Band>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    unit: "/ month",
    lede: "The local loop. Nothing here is billed.",
    items: [
      "Capture on a running page",
      "Measurements stay on this computer",
      "Optional local model",
      "Cursor connection",
      "Task history on your machine",
    ],
    cta: "Try the demo",
    href: DEMO_PATH,
  },
  {
    name: "Pro",
    price: "$12",
    unit: "/ month",
    lede: "For developers who build, share, and ship continuously.",
    items: [
      "Unlimited live previews",
      "Custom preview subdomains",
      "Secure guest review links",
      "Advanced AI context intelligence",
      "Extended development history",
      "Unlimited guest feedback",
      "Project sharing",
      "Priority support",
    ],
    cta: "Planned",
  },
  {
    name: "Team",
    price: "$29",
    unit: "/ user / month",
    lede: "A connected development environment for your entire team.",
    items: [
      "Shared team workspaces",
      "Multiple project collaborators",
      "Team review sessions",
      "Centralized development feedback",
      "Roles and permissions",
      "Shared agent activity",
      "Team-wide history",
      "GitHub workflow integrations",
    ],
    cta: "Planned",
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    lede: "For organizations building at scale.",
    items: [
      "Organization-wide administration",
      "Advanced security controls",
      "Custom deployment options",
      "SSO and access management",
      "Extended audit history",
      "Dedicated onboarding and support",
    ],
    cta: "Planned",
  },
];

export function PricingBand() {
  return (
    <Band id="pricing">
      <h2 className="max-w-[16ch] text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
        Pricing that grows with your ambition.
      </h2>
      <p className="mt-4 max-w-[36rem] text-[15px] leading-7 text-muted-foreground">
        The local loop is free. The other prices are a proposal, not something you can buy.
      </p>
      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "flex flex-col border-t border-border pt-8",
              plan.name === "Free" && "lg:col-span-7",
              plan.name === "Pro" && "lg:col-span-5",
              (plan.name === "Team" || plan.name === "Enterprise") && "lg:col-span-6",
            )}
          >
            <p className="text-sm text-muted-foreground">{plan.name}</p>
            <p className={cn("mt-2 tracking-[-0.03em] text-foreground", plan.name === "Pro" ? "text-6xl" : "text-4xl")}>
              {plan.price}
              <span className="ml-1 text-base text-muted-foreground">{plan.unit}</span>
            </p>
            <p className="mt-3 max-w-[36ch] text-sm leading-6 text-muted-foreground">{plan.lede}</p>
            <ul className="mt-5 space-y-1.5">
              {plan.items.map((item) => (
                <li key={item} className="text-sm leading-6 text-foreground/80">
                  {item}
                </li>
              ))}
            </ul>
            {"href" in plan && plan.href ? (
              <a
                href={plan.href}
                className={cn(buttonVariants({ variant: "accent" }), "mt-6 w-fit")}
              >
                {plan.cta}
              </a>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">{plan.cta}</p>
            )}
          </article>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Illustrative pricing and proposed plan features.
      </p>
    </Band>
  );
}

const faqs = [
  ["What is note’d?", "You point at something in a running page and say what should change. note’d keeps the measurement on your computer and turns it into a task Cursor can read."],
  ["Can I use note’d with my existing coding agent?", "Cursor works today. After you approve a task, Cursor reads it from the local connection. Other agents are not set up in this build."],
  ["Can other people access my localhost?", "No. The page and the task stay on your machine. A shareable preview is planned, and it is not available yet."],
  ["Do my teammates need to install note’d?", "The public demo needs no install. The local loop is for the person running the page. There is no shared review session yet."],
  ["Can clients and testers leave feedback?", "On the demo, yes. On your own app, you run the capture locally. A client cannot open your localhost yet."],
  ["Does note’d work with my existing projects?", "Yes, if the project is a running web page. Load the capture script, point at an element, and the measurement stays local. React and Vue pages can include the component name."],
  ["Can I use note’d on my own?", "Yes. That is the product today: one person, a running page, and an optional local model."],
];

export function FaqBand() {
  return (
    <Band id="faq" muted>
      <h2 className="max-w-[16ch] text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
        Built for the questions developers ask.
      </h2>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {faqs.map(([q, a]) => (
          <details key={q} className="group py-4">
            <summary className="cursor-pointer list-none text-sm text-foreground [&::-webkit-details-marker]:hidden">
              {q}
            </summary>
            <p className="mt-3 max-w-[62ch] text-sm leading-6 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </Band>
  );
}

export function CloseBand() {
  return (
    <section id="start" className="scroll-mt-20">
      <div className="mx-auto max-w-[760px] px-5 py-24 text-center sm:px-8">
        <h2 className="text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
          The best way to build is together.
        </h2>
        <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
          From your first idea to your next release, bring your development workflow
          into one connected experience.
        </p>
        <p className="mt-4 text-sm text-foreground">Your browser. Your agents. Your team.</p>
        <p className="mt-2 text-sm text-foreground">Everything moving forward, together.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={DEMO_PATH} className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
            Try the demo →
          </a>
          <a href="/#workspace" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Explore note’d
          </a>
        </div>
      </div>
    </section>
  );
}
