# DigiRise India — Forensic Baseline Audit

**Date:** 2026-08-29
**Auditor:** Principal IDE Agent
**Status:** Phase 0 Completed

## 1. Inventory Summary
Total files inventoried: 130
- **HTML:** 38 files
- **JS:** 20 files
- **CSS:** 7 files
- **JSON:** 10 files
- **XML:** 4 files
- **Markdown/Text:** 5+ files
- **Media:** Various `.png`, `.jpg`, `.webp`, `.ico` files

## 2. Directory Architecture
- `/blog/` (Static blog content, JSON registry)
- `/case-studies/` (Static deep dives)
- `/compare/` (Comparison matrices)
- `/css/` (Core styling, iOS26, nextgen, redesign)
- `/glossary/` (Term definitions)
- `/growth-partner-program/` (Partner funnel)
- `/industries/` (Industry-specific hubs)
- `/js/` (Interaction logic, islands, PWA)
- `/leads/` (Squeeze pages)
- `/locations/` (Geo-targeted landing pages)
- `/tools/` (Interactive calculators, analyzers, generators)
- `/audit/` (This baseline directory)

## 3. High-Priority Defect Verification (P0)

### P0-A: Tool Architecture Paths
- **Status:** Verified Broken.
- **Evidence:** `tools/website-speed-checker/index.html` references `/tools/js/speed.js` instead of the local file. The `tools/js/engines/` directory also contains redundant logic. Duplication confirmed.

### P0-B: Meta-Tag Regex Syntax Error
- **Status:** Verified Broken.
- **Evidence:** `tools/js/engines/meta-tag.js` line 23 contains `/.../ix`. The `x` flag is unsupported in JavaScript `RegExp`. 

### P0-C: Phantom Repair Scripts
- **Status:** Verified Missing.
- **Evidence:** `fix-blog.js` and `fix-ui.js` claimed in `REPAIR_REPORT_v5.6.md` do not exist in the root or any script directory.

### P0-D: Broken Relative Anchors
- **Status:** Verified Broken.
- **Evidence:** Several tools and blog pages rely on `../#section` rather than absolute root fragments `/#section`. 

### P0-E: Pricing Value Discrepancies
- **Status:** Verified Inconsistent.
- **Evidence:** FAQ blocks mention Starter at ₹5,999 while the JSON-LD and pricing arrays list it at ₹7,999.

### P0-F: Unsupported Industry/Location Claims
- **Status:** Verified Inconsistent.
- **Evidence:** The site advertises "12+ industries", but the filesystem only holds `sweets-and-food`, `jewelry`, and `fashion`. Similarly, location claims outpace actual physical pages (`delhi`, `dubai`, `kolkata`, `london`, `mumbai`).

## 4. Immediate Next Actions
Proceeding to Phase 1: Establish single source of truth data layers, then Phase 2: Execute correctness repairs.
