const columns = [
  {
    title: "Product",
    links: ["Overview", "Live Previews", "AI Workflows", "Collaboration", "Integrations"],
  },
  {
    title: "Developers",
    links: ["Documentation", "MCP", "GitHub", "API", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Community", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1040px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div>
          <p className="text-sm text-foreground">note’d</p>
          <p className="mt-2 text-sm text-muted-foreground">Build where it happens.</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm text-foreground">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#workspace" className="text-sm text-muted-foreground hover:text-foreground">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1040px] px-5 py-6 text-xs text-muted-foreground sm:px-8">
          © 2026 note’d. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
