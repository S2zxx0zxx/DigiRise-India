# Apper adoption decision — DigiRise India
Date: 2026-11-26. Status: proposed; no production integration authorized by this document.
Baseline: 957733cf2eba3d560c98706fd7c6641f9b693f5d.

## Evidence and architecture
- The repository has a root static/PWA site and a nested Vite application at `digirise-india/`. Do not assume which deployment is live from source alone.
- `digirise-india/package.json` declares Vite, Prisma, Upstash, Resend, Sentry, Vercel analytics and Vitest/Playwright tooling. The nested Vercel configuration declares build, headers and cron routes; actual deployment and cron execution were not checked.
- `digirise-india/prisma/schema.prisma` defines Lead, Slot and NewsletterSubscriber in PostgreSQL. `api/leads/audit.ts` validates an incoming lead, rate-limits it, persists it and optionally sends email. Keep PostgreSQL authoritative.
- The inspected tree exposes an audit lead handler but no dedicated lead lifecycle API. A separate DigiRise Admin beta README documents a Firebase-backed partner/commission system; do not duplicate or migrate that system on this evidence.
- Current static-site workflow checks file presence and JSON/robots; it does not establish nested API or E2E acceptance.
- Apper connector exposes creation of new projects, project-local source editing/build, a managed database, secret registration and edge functions. No existing GitHub repository import/sync action is exposed. Official roadmap lists own-GitHub two-way sync: https://apper.io/roadmap . Pricing: https://apper.io/pricing (free: 20 messages/month, 5000 records, 100 MB, just you; no capacity SLA established).

## Decision
Keep the existing marketing site, SEO, lead ingestion, Prisma schema, deployment and partner OS. Do not install a second data/auth stack or migrate the public domain. Apper is optional for a disposable, private, synthetic-data prototype of a founder-only lead triage console. No live data, real lead emails/phone numbers, production tokens, private source or payment data may be copied. No new paid subscription or production connection in this phase. No duplicate persistent lead record in Apper.

## Prioritized acceptance backlog
DR-A01: identify actual deployment/root, CI state, DB environment and partner OS boundary; inventory all lead entrypoints and existing admin functionality. Evidence: deployment IDs, source paths, sanitized request traces. No secret values.
DR-A02: verify lead ingestion in QA. Inspect trusted IP source, rate-limit failure behavior, input bounds, HTML email escaping, duplicate retries and email failure after DB commit. Add focused regression tests before changing behavior. An email failure must not misreport a committed lead as unsaved. Verify no PII in logs. No real emails in tests.
DR-A03: if A01 confirms a gap, prototype a founder lead-triage list, lead detail, status transitions, follow-up queue and aggregate funnel in an isolated Apper mock project. Use invented records only; no external API or database connection. Compare time-to-triage against native UI, mobile usability and keyboard accessibility. Delete or retain only as reference if no benefit.
DR-A04: if a live integration is ever justified, prefer native first-party API and same existing authentication. A separate connector requires documented server-to-server identity, read-only scoped aggregate endpoint initially, no direct DB credentials, timeouts, bounded queries, no PII, no cross-origin public access expansion, explicit revocation, and an off-by-default feature flag. Confirm contractual terms and pricing before activation. No public lead management endpoint.
DR-A05: add nested type-check/build/API tests and representative synthetic staging load tests; establish request volume, p95/p99, errors, rate-limit behavior, DB/Redis/notification costs. Set budgets from measured traffic and provider limits, not arbitrary user capacity.
DR-A06: production rollout only after owner review, dependency/security review, failure-isolation tests, no regression in SEO/forms, verified rollback, and cost envelope. Turn off any optional connector without losing leads.

## Required decision gate
Apper integration must demonstrate a measurable improvement over the native stack, verified cost and privacy constraints, and independent availability of the core lead path when Apper is down. Until then, no new runtime dependency. This document is an audit/decision only, not evidence of implemented fixes, verified production capacity, or a connected Apper application.
