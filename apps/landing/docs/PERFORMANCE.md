# Landing performance budget

Targets (mobile, slow 4G, Lighthouse):

| Metric | Budget |
|--------|--------|
| LCP | < 1.2s |
| INP | < 200ms |
| CLS | < 0.1 |
| Initial JS (gzip) | < 45 KB |
| Total JS (gzip, all chunks) | < 120 KB |

## Techniques in this app

- Self-hosted variable fonts (`@fontsource-variable/*`) — no render-blocking Google Fonts
- No icon library — inline SVGs only
- Viewport-deferred sections + `React.lazy` — below-fold code loads on scroll
- `content-visibility: auto` on deferred sections
- React / react-dom manual chunks for cache stability
- `modulePreload` polyfill disabled (modern browsers only)
- `prefers-reduced-motion` respected globally

## Verify

```bash
pnpm --filter @noted/landing build
pnpm --filter @noted/landing preview
# Lighthouse on http://localhost:4173
```
