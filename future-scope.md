# CodeMap — Future Scope

How this specific project could evolve beyond v1.0.0, grounded in decisions actually made during the 10-day build — not a generic feature wishlist.

---

## Next 3 months

**Automated testing & CI.** The single biggest honest gap from the Day 8 senior review: no test suite exists. Add unit tests for the pure logic in `lib/` (`validate.js`'s URL parsing, `curate.js`'s budget/priority logic, `parseReport.js`'s JSON handling — including the defensive cases Day 8 added) and an integration test for `POST /api/generate` against a mocked Gemini response. Wire into a GitHub Actions workflow that runs lint + tests on every push. This would have caught the Day 8 history-feature bug (a prop-name mismatch and a silently-broken validation filter) automatically, instead of requiring a manual senior review to surface it.

**"Good first issue" → file mapping.** The one stretch feature explicitly deferred from the original PRD cut list (Day 1). Now that the core pipeline is proven stable, this is the natural next differentiator: fetch a repo's open `good first issue`/`help wanted` issues via the GitHub API (already have the token and fetch patterns in `lib/github.js`) and use the already-curated file context to suggest where each issue likely needs to be solved.

**Lightweight architecture diagram.** The other deferred stretch goal. A Mermaid diagram generated from the folder structure already gathered by `curate.js`, rendered client-side as an optional sixth section or expandable panel.

**Basic usage visibility.** No way currently to know if anyone besides you has used the live app. Vercel Analytics (free tier, zero backend code) would answer that without adding any database.

## Next 6 months

**Agentic exploration upgrade.** Day 2's architecture doc explicitly scoped this as the "stronger version" of the product, deliberately deferred for time. Replace the static, deterministic curation in `lib/curate.js` with Gemini (or Claude) actively deciding what to read next via tool use — genuinely exploring the repo like a new contributor would, instead of a fixed priority/budget heuristic.

**Persistent report caching.** `SCHEMA.md` sketched a `report_cache` table back on Day 2 for exactly this, deliberately not built for v1.0. With real (if small) usage, caching previously-generated reports would cut both cost and the ~90 second wait for popular repos. A free tier of Vercel Postgres or Supabase is enough — no need to abandon the "no database in v1.0" simplicity, just extend past it deliberately.

**Private repository support.** The `users` table already sketched in `SCHEMA.md`. GitHub OAuth login, scoped only to reading private repos on the user's behalf, gated behind an explicit "Sign in" flow so the public, no-login core experience stays intact for anonymous users.

**Broader language support.** Currently JS/Python are the only fully-supported, tested languages (a deliberate Day 1 scoping decision). Expanding this means per-language prompt tuning and testing, not just removing the restriction.

## Next 12 months

**Browser extension / GitHub App.** Auto-surface a "Map this repo" button directly on any GitHub repository page a user visits — removing the copy-paste-URL step entirely.

**Follow-up chat.** Originally on the Day 1 roadmap: once a report exists, let a user ask specific follow-up questions about that repo, grounded in the same curated context already fetched.

**Multi-repo comparison mode.** A genuinely new capability building on a now-mature core: compare 2–3 candidate libraries side by side (stack, activity, structure) before choosing a dependency — a natural extension of the "Curious Contributor" persona into a "Curious Evaluator" use case.

**Sustainability consideration.** If usage ever justifies it, a modest hosted tier (caching, history, private repos) could offset API costs — explored only if real demand appears, not assumed upfront.

---
*Written Day 10 of the CodeMap capstone sprint.*
