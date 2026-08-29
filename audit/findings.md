# Findings with Evidence

## 1. P0-A: Standalone Tool Paths Incorrect
- **Location:** `tools/website-speed-checker/index.html` (Line ~50+)
- **Evidence:** Mentions `<script src="/tools/js/speed.js"></script>` but the correct file is located at `tools/website-speed-checker/js/speed.js`.

## 2. P0-B: Regex Syntax Error in meta-tag.js
- **Location:** `tools/js/engines/meta-tag.js:23`
- **Evidence:** `q.match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ix)` - the `x` flag is an invalid PCRE flag in JavaScript's standard RegExp implementation, causing a parsing error.

## 3. P0-C: Phantom Scripts
- **Location:** Project Root
- **Evidence:** `REPAIR_REPORT_v5.6.md` lines 7-8 claim that `fix-blog.js` and `fix-ui.js` were created as Node scripts. Listing the directory contents confirms they are absolutely missing from the file tree.

## 4. P0-D: Broken Relative Paths
- **Location:** `blog/index.html`, `tools/index.html`
- **Evidence:** Navigation `<a href="../#industries">` exists. Because the page is located at `/blog/` (a directory), the root relative path `/#industries` must be used instead of `../#industries`.

## 5. P0-E: Pricing Discrepancies
- **Location:** `index.html` (JSON-LD schema vs HTML Pricing Cards vs FAQ text)
- **Evidence:** Schema lines ~179 define "Starter" as "7999". However, FAQ copy strings historically claim "5999".

## 6. P0-F: Claims Mismatch
- **Location:** `index.html` (Hero copy) vs `/industries/` directory.
- **Evidence:** Site explicitly claims 12+ industries served. `list_dir` on `/industries/` only yields three physical subdirectories (`fashion`, `jewelry`, `sweets-and-food`). 

## 7. P1-C: Insecure CSP 
- **Location:** `index.html:5`
- **Evidence:** `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' ... script-src 'self' 'unsafe-inline'; ...">`

## Target Architecture Conclusion:
To resolve these findings safely without breaking the current functionality:
1. **Centralize Data:** Create `/data/*.json` registries.
2. **Normalize Tool JS:** Re-map all 4 calculators to use their respective engines from `tools/js/engines/` and remove redundant files.
3. **Regex Fix:** Convert the `x` flag regex into a standard compliant JS regex without altering the match semantics.
4. **URL Consistency:** Use absolute pathing `/#section` for cross-page navigation uniformly.
