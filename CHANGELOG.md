# Changelog

All notable changes to the DigiRise India website are documented here.

## v5.7 — 2026-07-11 — Marquee Render Fix
- Fixed: Resolved an invisible cloning bug in the trust badges marquee (`ios26.js`). Cloned elements incorrectly inherited the `.reveal-hidden` class, causing them to remain permanently invisible on scroll. 

## v5.6 — 2026-07-10 — Complete Structural Repair (Antigravity/Claude)
- Fixed: Blog relative paths migrated to absolute paths (`/css/`, `/js/`).
- Fixed: Redesigned desktop header and mobile menu; fixed empty mobile menu bug.
- Feature: Built custom UI Dropdown component; replaced all native `<select>` tags globally.
- Fixed: Scroll-Reveal Jank; implemented fail-visible CSS defaults and capped JS observers.
- Feature: Overhauled Dark Mode theme to "Matte Glowy Black" with radial ambient glow.

## v5.5 — 2026-07-10 — Tools Hub v2 & Site Repairs (Antigravity/Claude)
- Fixed: Bug 1 (Mobile menu ghost text) via `display: none` in ios26.css.
- Fixed: Bug 2 & 3 (Mobile Tools layout + bottom tab bar) via full HTML/CSS rebuild of tools dashboard.
- Fixed: Bug 4 (Hero headline double text) via `@supports` fallback in redesign.css.
- Fixed: Bug 6 (Horizontal overflow) via `overflow-x: hidden` on body in redesign.css.
- Built Tools Hub v2 App Shell: Command Card router (`router.js`), Fanned deck, Tabs (`hub.js`).
- Built 4 fully functional tools: Speed Checker (API), Ad Budget Calculator (Benchmarks), ROI Calculator, Ad Copy Generator.
- Added PWA shortcut for Tools Hub to `manifest.json`.
- Cached all new tool routes and assets in `sw.js` (v17).
- Appended 5 tool URLs to `sitemap.xml`.

## v5.4 — 2026-07-10 — Tools Hub Overlay Fix (Claude, user-reported)
- Fixed: Tools Hub pages (dashboard, speed checker, ad calculator) had nav overlapping/colliding with sidebar
- Root cause: global ios26.js island-nav morph fought tools.css's fixed-sidebar layout — now guarded per page
- Fixed 7 broken/no-op nav links on all 3 tools pages (unqualified #anchors + relative blog/ path)
- sw.js cache v16

## v5.3 — 2026-07-10 — Deep Repair & PWA/SEO Overhaul (Claude)
- Fixed homepage-pointing canonicals/og:url/hreflang on all 22 hub pages (critical SEO)
- PWA install repaired: valid manifest (in-scope shortcuts, correct maskable icons, real screenshots) — rich install UI, no fallback warning
- Full brand asset regeneration: icons, maskable set, apple-touch, favicon, OG image, shortcut icons, PWA screenshots (Midnight Gold)
- Rebuilt empty website-cost-india-2025 article; 7 branded blog hero images added
- Unified full mainNav + footer + single FAB bar across ALL blog pages (duplicates removed)
- Reality sweep round 3: fake partner badges, "3x ROI guarantee", "95% satisfaction", wrong @digirise.india handle — all removed/fixed
- llms.txt moved to root + Site Architecture section; sitemap refreshed; CI required-files fixed
- Junk purge: 10 one-shot build scripts, dupes, stubs, package files removed
- sw.js cache v15

## [Unreleased]

## v5.0 — Master Execution (July 2026)
**Comprehensive Scale & Conversion Overhaul:**
- 🎨 **Blog UI Unification:** The `/blog` directory now perfectly mirrors the homepage's Midnight Gold design system. Shared `redesign.css` and `ios26.css` globally.
- 🔒 **Privacy Sweep:** Complete eradication of old phone numbers. All CTAs and deep links universally rerouted to `digiriseindia@gmail.com`.
- 🤝 **Partner Portal Integration:** Injected premium glassmorphic Partner Login buttons into desktop and mobile navigations.
- 📈 **Extreme SEO & Squeeze Page:** Engineered `/leads/index.html` as a zero-distraction funnel for paid ads. Upgraded all blog posts with `LocalBusiness` + `ProfessionalService` structured JSON-LD schemas.
- ⚡ **PageSpeed Insights 95+:** Deep media optimization. Converted 10 uncompressed UI images and reel posters to WebP (via `sharp`). Added explicit `width`/`height` DOM attributes to eliminate Cumulative Layout Shift (CLS). Deferred blocking Google Fonts.
- 🔄 `sw.js` cache bumped to `v12`.

## v3.9 — PWA MAX (July 2026)
**App-Store Grade PWA Upgrade:**
- 🚀 **Manifest Rewrite:** Added 4 shortcuts (Audit, Packages, WhatsApp, Blog), Web Share Target, maskable icons, screenshots, and correct display overrides.
- 🚀 **Intelligent SW Engine:** Rewrote `sw.js` (v11) into a 5-bucket strategy (Network-first shell, LRU cached images, stale-while-revalidate static assets, opaque font cache). Fixed live bug where SW intercepted video `Range` requests, breaking video seeking.
- 🚀 **Branded Offline Fallback:** Replaced basic 404 fallback with a standalone `offline.html` featuring custom Midnight Gold UI, cached pricing, and auto-retry on reconnection.
- 🚀 **Smart Install Flow:** Added custom JS install prompt (`pwa.js`) triggered by engagement (30s time on site, scrolling to packages, or returning visits). Added iOS Safari "Add to Home Screen" instructions.
- 🚀 **Native Polish:** Added `env(safe-area-inset-*)` support in `ios26.css` for island nav and FABs, standalone mode overscroll prevention, and SW update toasts.

## v3.8 — Performance Deep Clean (July 2026)
**Root causes identified and fixed:**
- 🔴 **FIXED: Permanent 60fps rAF loop** — `initVelocityMarquee` (nextgen.js) was calling `requestAnimationFrame(tick)` unconditionally, running 60 times/second forever even when the user wasn't scrolling. Now loop only starts on scroll and self-terminates when velocity decays to near-zero.
- 🔴 **FIXED: 10 independent scroll listeners** (5 in nextgen.js + 5 in ios26.js), each calling `getBoundingClientRect()` — 16 forced layout recalcs per scroll tick. Consolidated 3 ios26.js listeners (island nav, timeline fill, back-to-top ring) into ONE shared orchestrator. Gated nextgen.js timeline listener to only activate when section is near viewport.
- 🔴 **FIXED: 30+ infinite CSS animations running off-screen** — Added a viewport-gated animation orchestrator in ios26.js that pauses/resumes animations per section using a single shared IntersectionObserver. Animations now only run when their section is within 100px of the viewport.
- 🟡 **FIXED: Duplicate 3D tilt handler** — Both nextgen.js:initTilt() and ios26.js:FIX-303 were attaching pointermove tilt to the same `.pkg-card` elements, doubling getBoundingClientRect calls per interaction. Removed redundant nextgen.js version.
- 🟡 **FIXED: initFlowDot setInterval** running getBoundingClientRect every 1.4s even when #process section was off-screen. Added IntersectionObserver guard.
- 🟡 **FIXED: 5 project images** missing `loading="lazy"` — now lazy + `decoding="async"`.
- 🟡 **FIXED: Permanent `will-change`** on .tilt3d, .hero-aurora, .marquee-track — now set/released dynamically by animation gate IIFE.
- 🟡 **FIXED: Duplicate `@keyframes fabBounce`** — removed second definition at ios26.css:688.
- **Scroll listeners:** 10 → 4 (1 batched main orchestrator + reel grid + step track + idle reset)
- **Permanent rAF loops:** 1 → 0
- **Simultaneous off-screen infinite animations:** ~30 → 0 (gated by viewport IO)
- `sw.js` bumped `v9`→`v10`


- 📱 **FIX 1:** Mobile package cards now stack vertically (all 4 visible, no hidden scroll). Removed 4 conflicting `.pkg-grid` CSS definitions and consolidated into one canonical responsive set: 4-col >1280px, 2-col 641–1280px, 1-col ≤640px. Popular card scale capped at 1.02 on mobile.
- ✨ **FIX 2:** Hero headline gradient text made fail-safe with `@supports` guard — solid gold fallback prevents invisible text when `background-clip:text` isn't supported. Copy updated to curiosity-gap hook: "Brands People Stop Scrolling For."
- 🎯 **FIX 3:** Client marquee tooltips now work on mobile via tap-toggle (touchstart handler). Added trust-chip marquee (8 factual chips: On-Time Delivery, 8 Pro Software, 3 Countries, etc.) scrolling opposite direction from client row.
- 📋 **FIX 4:** Hero service strip expanded from 5→10 verified services. Converts to auto-scrolling single-line marquee on mobile (≤768px) with mask-fade edges, preventing messy 4-line wrap.
- 🔄 `sw.js` cache bumped to `v9`.

## v3.2 — UI/UX Polish (July 2026)
- 🧹 Removed redundant client accordion below phone mockup, added tap-to-cycle to the mockup itself.
- 📱 Fixed mobile pricing section blank bug by adding error boundaries to initialization sequence.
- ⌚ Redesigned header live clock to a clean, flat monochrome pill style.
- 🕹️ Upgraded premium floating action bar (FAB) with circular icons, SVG theme toggle, and a VT323 LED brand display.

## [7.1] - 2026-06-20
### Added
- RSS feed (`feed.xml`) for blog content syndication
- `llms-full.txt` — full-text blog content for AI model citation/training (partial: 3 of 8 articles)
- `BingSiteAuth.xml` placeholder for Bing Webmaster Tools verification
- `opensearch.xml` for browser search integration
- `ai.txt` — AI crawler usage/training policy
- `.well-known/mcp.json` — Model Context Protocol manifest for AI agent discovery
- `.well-known/dnt-policy.txt` — Do Not Track policy
- `sw.js` — Service Worker for PWA offline support and asset caching
- Content-Security-Policy meta tag in `index.html`
- `check-blog-consistency` CI job to prevent phantom blog references
- Sitemap `lastmod` staleness warning step in CI workflow

## [7.0] - Earlier
### Added
- Initial SEO/AEO/GEO optimization pass
- llms.txt for AI discoverability
- Multi-currency pricing (INR/GBP/USD)
- Blog system with 8 published articles

## v3.0 — Midnight Gold iOS Edition (July 2026)
- 🏝️ Dynamic Island nav: glass pill, scroll collapse/expand, live slot ticker + section morph, progress ring
- 📱 Hero iPhone 15 Pro CSS frame: auto-scroll screen preview, 360° drag, ambient gold glow, mascot slot (assets/mascot.png)
- 💰 Pricing 3.0: India/UAE/UK segmented control, One-time/Retainer toggle (−20%), odometer count-up, conic gold popular border, expandable features, trust chips, iOS bottom sheet (drag-dismiss), sticky mini price bar
- 🎠 Trust badges → infinite marquee; 🎬 Reels → center-snap carousel (active autoplay, side dim); 💬 Testimonials → swipe card stack; 📈 Timeline scroll-fill gold line
- 🌗 Theme: View Transitions circular reveal, theme-color meta + manifest sync (#080604/#f7f2e9)
- 🔘 FAB idle bounce + "Baat karein? 👋", back-to-top progress ring, footer wave draw, CTA gold ripple, 3D tilt (pointer + gyroscope)
- ✅ AUDIT: reel6 phantom removed (card + schema), @digiriseindia → @digiriseindia (7×), 5 base64 → assets/projects/ (HTML 1.58MB → 365KB), sw.js v3
- ♿ prefers-reduced-motion full respect; zero external libraries

## v3.1 — Phase 6: Gaps Closure (July 2026)
- 🆚 Compare Mode: cards ↔ feature matrix morph toggle with highlight glow
- 🎠 Client logo DUAL marquee (opposite directions, grayscale→color hover, real-work tooltips)
- ⌚ Activity rings wired to real stats (200+, 4.9★, 3x ROI) — dead code fixed
- 🃏 Service cards: real 3D flip backs (pain point + top 3 services, per-industry color)
- ⚙️ Process steps: sequential light-up + gold progress bar (scroll + horizontal track)
- 🔊 Reel sound: island-pill button, functional mute/unmute, auto-mutes others, only on active reel
- 🎯 Radial FAB: gold + button → WhatsApp/Call/Instagram/Audit spring pop-out with scrim, idle bounce + tooltip
- 🌗 Theme: real iOS sun↔moon switch (knob slide, stars/rays, aria switch)
- 🧲 Magnetic hero CTA (pointer-follow) + gold ripple
- ✓ Trust chips wired to real clients per tier; scarcity bars animate 0→fill on view

## v3.4 — 8 User-Reported Fixes (July 2026)
1. Removed fake hero iPhone mockup (was static/non-functional) — hero now clean
2. Fixed FAB LED brand chip merging into WhatsApp button on mobile (padding/overflow fix)
3. Real Brands marquee: removed placeholder images, added Vidya Mandir Classes, PTJM SVM, The Liquid Lounge (text-only chips like existing ones)
4. Removed Proof-of-Work phone mockup — section left empty for future real content
5. Fixed Compare Table horizontal scroll (was janky) — smooth momentum scroll + snap
6. Fixed pricing grid showing only 1-3/4 cards on desktop — grid-template-columns corrected to repeat(4,1fr) with proper breakpoints
7. Replaced fake "View 200+ Results" button with functional Grid ↔ Carousel toggle for reels
8. Filled empty hero space (post-H1) with real service strip + animated scroll-cue to Proof of Work section
- sw.js bumped to v6

## v3.5 — Domain Migration + Full Reality Sweep (July 2026)
### Domain Migration
- All 313 references to digi-rise-india.vercel.app → https://digiriseindia.tech across index.html, sitemap.xml (+lastmod bumped to today), robots.txt, ai.txt, llms.txt, llms-full.txt, opensearch.xml, security.txt, mcp.json, feed.xml, .well-known/security.txt, blog/index.html, all 8 blog posts
- manifest.json uses relative start_url — no change needed
- sw.js bumped to v7
- MANUAL ACTION STILL REQUIRED: add digiriseindia.tech in Vercel dashboard, verify DNS, set up 301 redirect from old Vercel URL (see domain migration prompt)

### Reality Sweep — Zero Fake Claims
- Removed all "200+", "4.9★/4.9/5", "3x ROI", "95% satisfaction", "50+ industries" claims (60+ instances across index.html, llms.txt, llms-full.txt, and 8 blog posts)
- Removed "Or Your Money Back" hero claim → "Delivered, Guaranteed."
- Removed fake price anchoring: all oldPrice fields, savingsPct/% OFF pills, AUTHORITY countdown timer, addon fake "was" prices
- Fixed quiz result crash risk (pkg.oldPrice no longer exists — qr-old/qr-save now safely hidden instead of erroring)
- Removed fake per-package social proof ("47/89/31/12 businesses...")
- Removed fake live slot counters → honest "Limited onboarding har month" line
- **Major finding: removed entirely fabricated case study** — "Urban Homes" (+185% leads, +320% revenue) and 4 other fake client names (Flex Fitness, Glam Studio, Wellcare Clinic, Success Academy, Shoppers World) with invented testimonials, replaced across index.html, llms.txt, llms-full.txt, and blog/digirise-india-8-software-1-agency-2026.html with real client roster (LAL Sweets, Kirtilals, TradeScribe, FarmFres, Murzban, The Liquid Lounge)
- Hero stats reframed to verifiable facts: 12+ industries, 8 software, 3 countries, 100% deliverables guarantee
- Trust badges reframed as tools (Google Ads & GA4) instead of vague "verified" claims
