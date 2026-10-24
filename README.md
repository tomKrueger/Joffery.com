# Joffery.com

Marketing site for [Joffery](https://joffery.com) — the BizOps platform for growing companies.

## Site structure

Static site lives in `/docs` (HTML, CSS, JS — no build step). GitHub Pages can serve from the `/docs` folder on any branch.

- `docs/index.html` — homepage with interactive product preview, Stack & Spend calculator, and early-access flow
- `docs/css/ledger.css` — styles
- `docs/js/ledger.js` — interactions
- `docs/CNAME` — custom domain (`joffery.com`); **keep this file** when changing branches

## Publishing on GitHub Pages

**Today:** Pages may still point at `main` and the legacy Mobirise export.

**When this redesign is ready to go live:**

1. Merge the redesign PR (or use the feature branch directly without merging to `main` if you prefer to preview first).
2. In the repository **Settings → Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** select `cursor/joffery-marketing-redesign-9f4c` (or `main` after merge) and folder **`/docs`**
3. Confirm `docs/CNAME` still contains `joffery.com`.
4. Wait for the Pages build; DNS for `joffery.com` should already point at GitHub Pages.

To preview locally:

```bash
cd docs && python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Branches

- `main` — previous site (unchanged until you merge or switch Pages source)
- `cursor/joffery-marketing-redesign-9f4c` — Operations Command Ledger redesign (new SVG brand, PLG pricing, MSP partner workspace preview)

## Brand assets

Custom mark and wordmark live in `docs/assets/brand/` (`joffery-icon.svg`, `joffery-logo.svg`). The Mobirise-era logo and template assets are removed on the redesign branch.
