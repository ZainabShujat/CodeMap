# CodeMap — Database Schema

## v1.0 Decision: No Database

CodeMap's v1.0 core loop is fully stateless: a repo URL comes in, a report goes out, and nothing needs to be remembered between requests. Adding a database now would be infrastructure with no user story behind it — direct scope creep against the PRD's own cut-list spirit. So v1.0 ships with **zero persistent storage**.

### Validating this against every v1.0 user story

| User story (from PRD) | Requires storage? | Why / why not |
|---|---|---|
| Paste a repo link and understand what the project does | No | Generated fresh from GitHub + Claude on each request. |
| See the tech stack at a glance | No | Same single synthesis response. |
| Folder structure explained in plain English | No | Same. |
| Know the best entry points into the code | No | Same. |
| Setup instructions summarized clearly | No | Same. |
| Clear error message on invalid URL / private repo / rate limit | No | Computed and returned in the same request; nothing to remember afterward. |
| Visible progress while the report generates | No | Client-side UI state only, not persisted server-side. |

No v1.0 user story needs an account, a history, or a cache. Confirmed: **no database for v1.0.**

### What this simplifies

- No schema migrations, no ORM, no hosted database free-tier limits to track.
- No data-privacy surface to design around (nothing about a submitted repo is stored after the response is sent).
- Day 3 setup shrinks — there's no database account to create or connection string to manage.

---

## Future Schema (Not Built in v1.0)

Two roadmap items from the PRD would require storage if built later. Sketched here only so future-you isn't starting from zero — **do not build these now.**

### `report_cache` (supports: caching/history roadmap item)

| Field | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `repo_url` | text, indexed | Normalized GitHub URL |
| `sections_json` | jsonb | The five-section report, stored verbatim |
| `generated_at` | timestamp | |
| `expires_at` | timestamp | Cache invalidation — repos change, so entries should expire |

### `users` (supports: private-repo OAuth roadmap item only)

| Field | Type | Notes |
|---|---|---|
| `id` | UUID (PK) | |
| `github_id` | text, unique | From GitHub OAuth |
| `access_token_encrypted` | text | Never store a raw token |
| `created_at` | timestamp | |

Constraints/relationships: `report_cache.repo_url` would be looked up before hitting GitHub/Claude again; `users` would only exist to hold an encrypted OAuth token scoped to reading private repos on the user's behalf — no other user data is needed even in this future state.

---

*Last updated: Day 2 of the CodeMap capstone sprint.*
