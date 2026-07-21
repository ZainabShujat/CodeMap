# CodeMap — API Design

Two endpoints. That's the whole v1.0 surface — no unnecessary scope.

---

## `POST /api/generate`

**Purpose:** The core loop. Accepts a public GitHub repo URL and returns the five-section onboarding report.

### Request

```
POST /api/generate
Content-Type: application/json

{
  "repoUrl": "https://github.com/owner/repo"
}
```

### Response — success (200)

```json
{
  "status": "success",
  "repo": {
    "owner": "owner",
    "name": "repo",
    "primaryLanguage": "JavaScript",
    "supportedLanguage": true
  },
  "sections": {
    "projectOverview": "string",
    "techStack": "string",
    "folderStructure": "string",
    "whereToStart": "string",
    "setupInstructions": "string"
  },
  "meta": {
    "filesAnalyzed": 23,
    "generationTimeMs": 41500
  }
}
```

### Validation

1. `repoUrl` is present and is a string.
2. Matches a GitHub URL pattern: `https://github.com/{owner}/{repo}` (trailing slashes, `.git` suffix, and branch/path suffixes are normalized/stripped).
3. Repo exists and is public (checked via a GitHub metadata call before running the full pipeline — fail fast, don't waste a Claude call on a repo we can't read).

### Authentication

None. Public endpoint, no login required (NFR4). To protect against abuse, the route applies a simple IP-based rate limit (e.g. N requests/minute) — this is a defensive measure, not a product feature, and is safe to cut first if it eats into build time.

### Error cases

| Status | Meaning | Example body |
|---|---|---|
| 400 | Malformed or missing `repoUrl` | `{ "status": "error", "code": "INVALID_URL", "message": "That doesn't look like a GitHub repository URL." }` |
| 404 | Repo doesn't exist, or is private | `{ "status": "error", "code": "REPO_NOT_ACCESSIBLE", "message": "We can't reach that repository. Make sure it's public." }` |
| 422 | Repo is accessible but not JS/Python | `{ "status": "error", "code": "UNSUPPORTED_LANGUAGE", "message": "This repo's primary language isn't fully supported yet — results may be less reliable." }` *(soft warning, not a hard block — see FR4)* |
| 429 | GitHub or Claude rate limit hit | `{ "status": "error", "code": "RATE_LIMITED", "message": "Too many requests right now — try again in a minute." }` |
| 504 | Claude generation exceeded the timeout | `{ "status": "error", "code": "GENERATION_TIMEOUT", "message": "This repo is taking longer than expected. Try again, or try a smaller repo." }` |
| 500 | Unexpected server error | `{ "status": "error", "code": "INTERNAL_ERROR", "message": "Something went wrong on our end." }` |

---

## `GET /api/health`

**Purpose:** A lightweight uptime check — lets us (and, during Day 9 testing, a monitoring ping) confirm the deployed app is alive before/during a demo. Trivial to build; cut immediately if any day runs long, since it has zero end-user value on its own.

### Request

```
GET /api/health
```

### Response — success (200)

```json
{ "status": "ok", "timestamp": "2026-07-21T12:00:00Z" }
```

### Validation

None — no inputs.

### Authentication

None.

### Error cases

None expected; if the function can't execute at all, Vercel returns its own 500, which is itself the signal something is wrong.

---

*Last updated: Day 2 of the CodeMap capstone sprint.*
