# Wintermute one-page site

A static one-page site for the [Wintermute](https://github.com/ncksol/ai_tools/tree/main/ghcp/plugins/wintermute) Copilot plugin. Plain HTML and CSS, a little JavaScript for the copy buttons and the sample dashboard, and no build step.

## Files

- `index.html`: the page. Every asset URL is relative, so it works from a domain root or a sub-path such as `/ai_tools/`. The exception is the Open Graph and Twitter Card tags, which need absolute URLs and point at `https://ncksol.dev/wintermute/`.
- `assets/site.css`: all styles. Desktop layout above 640px, the mobile layout at 640px and below.
- `assets/site.js`: copy-to-clipboard buttons.
- `assets/dash.css`, `assets/dash.js`: the sample dashboard in `#dashboard`, built as HTML from the plugin's demo data in its dark Cards view. The styles are adapted from the plugin's `ui/styles.css` and scoped under `.wd`. The script ticks the sample clocks (not under reduced motion) and folds the card footers to fit, as `ui/footer.mjs` does.
- `assets/fonts/`: self-hosted IBM Plex Sans and Space Mono (Latin subset, woff2, weights 400, 600 and 700 for Plex and 400 and 700 for Space Mono, from Fontsource 5.3.0), with their SIL Open Font License files.
- `assets/img/logo.svg`, `assets/img/mark.svg`, `favicon.svg`: the mark from the plugin's `docs/images/banner-dark.svg`, with the same coordinates and colours. `logo.svg` keeps the banner's blueprint grid; `favicon.svg` adds a dark plate behind the unchanged mark.
- `assets/img/*.png`: icons rendered from `favicon.svg` (32, 192, 512) and `mark.svg` (180, Apple touch icon).
- `assets/img/og.png`: the social preview image (1200×630, opaque PNG, under 300 KB), rendered from HTML with the same fonts and mark. When you replace it, bump the `?v=` query in the `og:image` and `twitter:image` tags so link-preview caches fetch the new file.
- `site.webmanifest`: name and icons, with relative paths.

The page loads nothing from other hosts.

## Preview

```bash
cd wintermute-site
python3 -m http.server 8000
```

Then open http://127.0.0.1:8000/.

## Publish

Copy the folder's contents to any static host, for example a GitHub Pages branch or folder. No configuration is needed.
