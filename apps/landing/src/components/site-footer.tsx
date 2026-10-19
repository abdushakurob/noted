import { DEMO_PATH, DOCS_PATH, GITHUB_URL } from "@/lib/site-config";

const links = [
  { href: DEMO_PATH, label: "Demo", external: false },
  { href: DOCS_PATH, label: "Docs", external: false },
  { href: GITHUB_URL, label: "GitHub", external: true },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1040px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-foreground">
          note’d <span className="text-muted-foreground">· Point at the page. The task stays here.</span>
        </p>
        <nav className="flex items-center gap-5" aria-label="Footer">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground"
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
