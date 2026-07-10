# Matte Black Migration Log

**Date:** 2026-07-11
**Total Files Changed:** 32 (30 HTML files, 2 JS files)
**Total Gold Instances Replaced:** 150+ variables, hex codes, and RGB definitions.
**Light Mode Status:** Intentionally skipped and left untouched.

## Component Decisions

- **Buttons (`ios26.css` & `blog.css`):** Solid gold buttons (`var(--gold)`) were changed to pure white (`#ffffff` or `#f2f2f2`). The text color inside these buttons was explicitly updated from `#fff` to `#0a0a0a` to guarantee high contrast.
- **Rings & SVG Gradients (`ios26.css`):** The `goldRingGrad` SVG definition was renamed to `monoRingGrad` across the HTML and JS, substituting bright gold stops with `#ffffff` and `#c9c9c9`. 
- **Inline Block Replacements:** Replaced the specific `[data-theme="dark"]` inline variable definitions directly inside 20+ templates via Node script.

## File Modification Log

| File | What Changed | Old Value(s) | New Value(s) |
|---|---|---|---|
| `css/redesign.css` | Updated root dark palette variables | `--gold: #b87b0a`, `--bg: #080604` | `--gold: #f2f2f2`, `--bg: #0a0a0a` (monochrome) |
| `css/ios26.css` | Text color on gold-background buttons; SVG gradient renaming | `color: #fff`, `url(#goldRingGrad)` | `color: #0a0a0a`, `url(#monoRingGrad)` |
| `css/blog.css` | Gradients and pill backgrounds | `linear-gradient(..., #c8890a, ...)` | `linear-gradient(..., #ffffff, #c9c9c9)` |
| `tools/css/tools.css` | Removed dark mode gold accents | `--hub-gold-deep: #c8890a` | `--hub-gold-deep: #c9c9c9` |
| `js/ios26.js` | Dynamic SVG gradient updated | `#f5d78a` / `#ffffff` | `#c9c9c9` / `#ffffff` |
| `index.html` (and 20+ other HTML files) | Replaced dark-mode inline CSS variables and `.addon-card.featured` hardcoded hexes | `[data-theme="dark"]` block with `#e09d20`, etc. | Pure white and matte black palette |
| `nuke-gold.js` | Cleaned up residual gold hexes | `--gold:#b87b0a`, etc. | `--gold:#f2f2f2`, etc. |

## Bug 10: Dark Mode Flat/Washed-Out Grey Fix

**Status:** Resolved
**Issue:** Dark mode background read as a flat, slightly washed-out grey-black on OLED/AMOLED screens, lacking premium depth. Cards blended into the background without sufficient lightness separation.

### What Was Fixed
- **Deep Glass Black Base:** Updated `--bg`/`--bg2`/`--bg3`/`--card` values to true near-black with clearer lightness separation (from `#0a0a0a` to `#050505` base, `#101010` card).
- **Gradient Wash:** Added a subtle radial gradient wash to the dark-mode body background to eliminate the "flat plastic" look.
- **Material Grain/Noise:** Injected a barely-visible SVG noise/grain texture overlay pseudo-element to add material richness.
- **Card Depth:** Strengthened card borders and ensured shadows (`var(--shadow)`) apply correctly to `.card`, `.pkg-card`, etc. so surfaces read as "raised".
- **Light Mode Safety:** Confirmed light mode was completely unaffected.
