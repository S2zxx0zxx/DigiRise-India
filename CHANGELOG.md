# Changelog

All notable changes to the DigiRise India website are documented here.

## [Unreleased]

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
- ✅ AUDIT: reel6 phantom removed (card + schema), @digirise.india → @digiriseindia (7×), 5 base64 → assets/projects/ (HTML 1.58MB → 365KB), sw.js v3
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
