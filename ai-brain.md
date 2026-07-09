# DigiRise India — AI Brain File
**Purpose:** This file acts as the central knowledge base for AI agents operating within the DigiRise India repository. It must be consulted before making structural, styling, or logical changes to ensure the project's integrity, design language, and SEO standing are maintained.

**Last Updated:** Automatically updated alongside major repository changes.

---

## 1. Project Overview & Tech Stack
**DigiRise India** is a premium digital marketing agency website. 
- **Stack:** Pure HTML5, CSS3, Vanilla JavaScript. 
- **Dependencies:** ZERO. No React, Vue, jQuery, Tailwind, or build tools (Webpack/Vite). 
- **Deployment:** Vercel (Static hosting).
- **Architecture:** A monolithic single-page application (`index.html`) accompanied by a static multi-page blog architecture (`blog/`).

**CRITICAL RULE:** Do not introduce modern JS frameworks or build pipelines. All code must run natively in the browser without compilation.

---

## 2. File Structure & Responsibilities

| File/Folder | Purpose & Agent Instructions |
| --- | --- |
| `index.html` | The main SPA. Contains all core UI sections, deep Schema.org JSON-LD structured data, and SEO meta tags. |
| `redesign.css` | The core design system ("Midnight Gold Luxury"). Overrides older CSS. Contains all CSS variables for theming. |
| `nextgen.js` | Interaction logic (scrollspies, 3D tilts, split-text animations, exit intent, WhatsApp widget). Pure Vanilla JS only. |
| `nextgen.css` | Specific animation and motion styling that supports `nextgen.js`. |
| `llms.txt` / `llms-full.txt` | Context files for AI crawlers (ChatGPT, Claude, etc.). Must be kept in sync with any business/service updates. |
| `ai.txt` | Defines AI crawler permissions and attribution requirements. |
| `mcp.json` | Manifest linking structured data sources for AI model consumption. |
| `blog/` | Contains static HTML blog posts and `blogs.json` (metadata index for the blog). |
| `assets/` | Static media (images, icons). Contains `reels/` for video assets. |
| `sw.js` / `manifest.json` | PWA implementation and service worker caching logic. |

---

## 3. Design System: "Midnight Gold Luxury"

All styling is managed via CSS variables in `redesign.css`. 
- **Primary Theme:** Dark Mode (`[data-theme="dark"]`). Light mode exists as a secondary option.
- **Typography:** 
  - Headings/Titles: `'Space Grotesk'`
  - Body/UI: `'Plus Jakarta Sans'`
- **Color Palette Variables:**
  - Gold Accents: `--gold`, `--gold-mid`, `--gold-light`, `--gold-deep`, `--gold-pale`
  - Backgrounds: `--bg`, `--bg2`, `--bg3`
  - Cards/Glass: `--card`, `--border`, `--border2`, `--divider`
  - Text: `--text`, `--text2`, `--muted`
- **Aesthetic Rules:**
  - **Glassmorphism:** Use `rgba` backgrounds with `backdrop-filter: blur()`.
  - **Glows vs Shadows:** Prefer neon-gold glows (`box-shadow: 0 0 40px rgba(...)`) over hard drop shadows in dark mode.
  - **Corners:** High border-radii (14px to 26px for cards, 999px for pills/buttons).

**CRITICAL RULE:** Do not hardcode colors (e.g., `#ff0000`). Always map to the existing CSS variables.

---

## 4. Interaction & Logic (`nextgen.js`)

All JS must be encapsulated, side-effect-free, and respectful of user preferences.
- Use `IntersectionObserver` for scroll-based animations (avoid scroll event listeners when possible for performance).
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')` before applying complex animations.
- Check `window.matchMedia('(pointer: coarse)')` to disable hover/tilt effects on touch devices.
- Wrap initializations in a generic `onReady` DOMContentLoaded check.

---

## 5. SEO & AI Crawler Context

DigiRise India relies heavily on Search Engine Optimization and Answer Engine Optimization (AEO).
- **JSON-LD Schema:** `index.html` contains deep structured data (LocalBusiness, WebSite, BreadcrumbList, ItemList for Services, Person for Founder, HowTo, FAQPage). If services or pricing change, update these schemas.
- **Hreflang & Canonical:** Always maintain proper tags for `en-IN`, `hi-IN`, `en-GB`, `en-US`.
- **AI Crawler Files:** 
  - `llms.txt` is the summarized context for AI bots. 
  - `llms-full.txt` contains full text of blogs. 
  - **CRITICAL RULE:** If you add a new service, change a price, or create a new blog post, you MUST update `llms.txt` and `llms-full.txt` so AI search engines have the latest facts.

---

## 6. AI Agent Update Protocols (Strict Instructions)

Whenever you (the AI Agent) are asked to modify or update the repository, strictly follow this checklist:

1. **Blog Updates:** 
   - If writing a new blog, create the `.html` file inside `blog/`.
   - Update `blog/index.html` to display the new post.
   - Update `blog/blogs.json` with the new metadata.
   - Append the blog text to `llms-full.txt`.
   - Update the blog list in `llms.txt`.
2. **Pricing & Services:**
   - Modify the UI in `index.html`.
   - Modify the JSON-LD Schema in `index.html`.
   - Modify the corresponding text in `llms.txt`.
3. **Styling/CSS Changes:**
   - Only edit `redesign.css` or `nextgen.css`. Do not add inline styles unless dynamically injected via JavaScript.
4. **Data Preservation:**
   - Do not remove or alter existing Google Analytics / Vercel Web Analytics scripts.
   - Maintain all semantic HTML tags (`<article>`, `<section>`, `<nav>`, `<aside>`).

---
*End of Brain File. Refer back to these guidelines continuously during operations.*
