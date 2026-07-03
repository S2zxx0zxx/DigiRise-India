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
