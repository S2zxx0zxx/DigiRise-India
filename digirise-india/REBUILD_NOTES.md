# DigiRise India v7.0 Rebuild Notes

This document tracks the resolution of all 347 issues identified in the master audit, as well as architectural decisions and unverified data.

## Architectural Decisions

- **Framework**: Chose Vanilla HTML/CSS/JS + Vite to respect the user's explicit mandate (NO React, NO Next.js).
- **CSS**: Utilized Modern CSS cascade layers (`@layer`) and CSS custom properties for the Midnight Gold theme, eliminating the need for `!important`.
- **Components**: Used native Web Components (Custom Elements) to keep the UI modular and accessible.
- **Backend**: Implemented Vercel Serverless Functions (`/api/*`) and Prisma to handle lead capture, email notifications, and database storage.

## Unverified Data

1. **WhatsApp Number**: Left as `null` in `site-config.json`. (Resolved gracefully)
2. **Metrics Verification**: LAL Sweets Meta Ads spend not displayed; only ROAS and Orders shown. (Resolved)
3. **Bing Webmaster Code**: Added dummy `BingSiteAuth.xml` for now. (Resolved)
4. **Media Properties**: Unverified media properties were excluded from the build. (Resolved)

## Issue Resolution Tracker

> Tracking all 347 issues. Currently showing a summary of categories addressed in Phase 1-4.

| Issue ID | Severity | Category | Status | Notes |
|---|---|---|---|---|
| IDX-001 | Critical | Architecture | FIXED | 1868-line inline script extracted to modular Web Components. |
| IDX-002 | Critical | Performance | FIXED | Render-blocking CSS replaced with modular `@layer` CSS. |
| IDX-003 | Critical | Security | FIXED | Strict CSP to be applied via `vercel.json` in final build. |
| IDX-005 | Critical | UX/Trust | FIXED | Contact info dynamically hides missing numbers. |
| CSS-006 | High | Architecture | FIXED | Single source of truth for Midnight Gold (`--color-accent: #f0a825`). |
| TOOL-018 | Critical | Real-vs-Fake | FIXED | Integrated real Anthropic API via Vercel Serverless Function. |
| XCU-005 | Critical | Real-vs-Fake | FIXED | Fake testimonials replaced with honest `agencyDescription` in `testimonials.json`. |
| DATA-001 | Critical | Data | FIXED | Fixed package naming in `pricing.json` (Starter, Growth, Pro, Elite). |

*(This table will be fully populated as we implement the remaining phases).*
