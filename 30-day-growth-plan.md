# CodeMap — 30-Day Growth Plan

A realistic, day-by-day roadmap taking CodeMap from v1.0.0 (this capstone) toward the "Next 3 months" items in `future-scope.md`. Each day builds on the previous one — this is not a menu to pick from, it's a sequence.

## Week 1 — Testing foundation (closes the Day 8 review's biggest gap)

- **Day 1:** Install and configure a test runner (Vitest recommended — fast, zero-config with Vite/Next.js). Write the project's first test: `lib/validate.js`'s `parseRepoUrl`, covering the exact edge cases found during the sprint (trailing slashes, `.git` suffixes, query strings from Day 8, invalid input).
- **Day 2:** Write tests for `lib/curate.js` — verify README/manifest/entry-point files are always included regardless of size, verify the budget cap actually stops inclusion, verify exclusion patterns (`node_modules`, lockfiles, binaries) work.
- **Day 3:** Write tests for `lib/parseReport.js` — valid JSON, fenced JSON, malformed JSON, and the Day 8 defensive case (valid JSON that isn't a plain object).
- **Day 4:** Write an integration test for `POST /api/generate` using a mocked Gemini response (don't spend real API credits on every test run) — cover the success path and each error code (400, 404, 429, 504, 500).
- **Day 5:** Set up GitHub Actions: a workflow that runs `npm run lint` and the new test suite on every push and pull request. Confirm it actually fails on a deliberately broken test before trusting it.
- **Day 6:** Buffer day — fix anything the new test suite reveals that wasn't caught by manual testing.
- **Day 7:** Add Vercel Analytics (free tier, no backend code) for basic visibility into whether the deployed app is actually being used.

## Week 2 — "Good first issue" mapping (the Day 1 stretch goal, finally built)

- **Day 8:** Build `lib/issues.js` — fetch a repo's open issues labeled `good first issue` or `help wanted` via the GitHub REST API.
- **Day 9:** Extend `POST /api/generate`'s response shape to include the fetched issues alongside the existing five sections.
- **Day 10:** Extend the Gemini prompt so it maps each issue to a likely relevant file or area, using the same curated file context already gathered.
- **Day 11:** Build a UI component (`components/IssueSuggestions.jsx`) to display these mapped issues in `ReportView`.
- **Day 12:** Test against 5+ real repos with genuine open `good first issue` labels; fix whatever real data reveals.
- **Day 13:** Buffer/polish day for this feature specifically.

## Week 3 — Visual architecture diagram (the other Day 1 stretch goal)

- **Day 14:** Build `lib/diagram.js` — generate a Mermaid diagram definition from the folder structure already available in the curated file tree.
- **Day 15:** Wire diagram generation into the existing pipeline as an additional field in the API response.
- **Day 16:** Add the `mermaid` client library and build a component that renders a Mermaid definition string into an actual diagram in the browser.
- **Day 17:** Add the diagram as an optional sixth, expandable section in `ReportView`, matching the existing visual style.
- **Day 18:** Test against repos with varied structures (flat, deeply nested, monorepo) and fix rendering edge cases.
- **Day 19:** Buffer/polish day for the diagram feature.

## Week 4 — Persistent caching (the `SCHEMA.md` design from Day 2, finally built)

- **Day 20:** Set up a free-tier Postgres instance (Vercel Postgres or Supabase) and create the `report_cache` table exactly as sketched in `SCHEMA.md`.
- **Day 21:** Implement the cache-write path — save each successfully generated report.
- **Day 22:** Implement the cache-read path in `/api/generate` — check the cache before hitting GitHub and Gemini at all.
- **Day 23:** Add a UI indicator distinguishing a cached result from a freshly generated one.
- **Day 24:** Add cache expiry (e.g. a 7-day TTL) so stale reports of actively-changing repos don't linger forever.
- **Day 25:** Test the full caching path end to end; measure and record the real latency/cost improvement (following the sprint's own habit of verifying performance claims with real numbers, not assumptions).
- **Day 26:** Buffer/polish day for caching.

## Final stretch

- **Day 27:** Full regression pass across every feature built this month (history, good-first-issue mapping, diagrams, caching) together — confirm nothing conflicts.
- **Day 28:** Update `README.md`, `ARCHITECTURE.md`, and `SCHEMA.md` to reflect the new v1.1 feature set.
- **Day 29:** Write and publish a short launch post about the v1.1 update; gather real feedback.
- **Day 30:** Address the most actionable feedback received, then tag and release **v1.1.0**.

---
*Written Day 10 of the CodeMap capstone sprint, as a direct continuation of the roadmap in `future-scope.md`.*
