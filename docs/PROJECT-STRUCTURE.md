# CodeMap — Project Structure

```
codemap/
├── app/
│   ├── page.js                 # Home page: renders Input / Loading / Report / Error states
│   ├── layout.js                # Root layout, global font/meta setup
│   ├── globals.css              # Tailwind base styles
│   └── api/
│       ├── generate/
│       │   └── route.js         # POST /api/generate — the core loop
│       └── health/
│           └── route.js         # GET /api/health — uptime check
│
├── lib/
│   ├── github.js                 # Fetch repo metadata, file tree, and file contents from GitHub REST API
│   ├── curate.js                 # File-curation logic: README/manifest/entry points + token-budgeted sampling
│   ├── claude.js                 # Anthropic SDK wrapper + the synthesis prompt template
│   ├── parseReport.js            # Parses Claude's JSON response into the 5 report sections
│   └── validate.js               # URL validation / normalization helpers
│
├── components/
│   ├── RepoInputForm.jsx         # The input field + Generate button
│   ├── LoadingState.jsx          # Progress indicator during generation
│   ├── ReportView.jsx            # Renders the 5-section report
│   └── ErrorBanner.jsx           # Inline error display
│
├── docs/
│   ├── CodeMap_PRD.docx
│   ├── CodeMap_Sprint_Workbook.docx
│   ├── CodeMap_Pitch_Deck.pptx
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md
│   └── PROJECT_LOG.md
│
├── public/
│   └── favicon.ico               # Static assets
│
├── .env.local                    # ANTHROPIC_API_KEY, GITHUB_TOKEN (gitignored, never committed)
├── .env.example                  # Documents the required env vars without real values
├── .gitignore
├── package.json
├── vercel.json                   # Fluid Compute + maxDuration configuration
└── README.md
```

## What each folder is responsible for

| Folder | Responsibility |
|---|---|
| `app/` | Everything Next.js's App Router serves directly — pages and API routes. This is the only place that knows about HTTP requests/responses. |
| `app/api/` | The two endpoints defined in `API.md`. Route handlers here should stay thin — they call into `lib/`, they don't contain business logic themselves. |
| `lib/` | All the actual pipeline logic: talking to GitHub, curating files, talking to Claude, parsing the result. This is where Day 4 and Day 5 implementation work lives. Framework-agnostic on purpose — if we ever swap Next.js for something else, `lib/` barely changes. |
| `components/` | Presentational React pieces used by `app/page.js`. Each one maps to a piece of a wireframe in `UI-WIREFRAMES.md`. |
| `docs/` | Every planning document from Day 1 and Day 2, plus the running project log. Nothing here is executable — it's the paper trail. |
| `public/` | Static files served as-is (favicon, any static images). |

## Why this structure

- **`lib/` separated from `app/api/`** so the core pipeline logic isn't tangled up with HTTP-specific code — makes it possible to unit-test `lib/` functions directly on Day 7 without spinning up a server.
- **No `models/` or `db/` folder** — consistent with the Day 2 decision in `SCHEMA.md` that v1.0 has no database.
- **No `pages/` (old Next.js router)** — the App Router (`app/`) is the current, actively maintained Next.js convention and is simpler for a project this size.
- **Flat and shallow on purpose.** Every folder here maps to something concrete in the architecture or API docs — nothing was added "just in case."

## Where future code will live

- Agentic exploration (roadmap) → a new `lib/agent.js`, replacing the static logic in `lib/curate.js`.
- Chat Q&A (roadmap) → a new `app/api/chat/route.js` and a `ChatPanel.jsx` component.
- Private repo OAuth (roadmap) → a new `app/api/auth/` route group, plus the `users` table sketched in `SCHEMA.md`.

---

*Last updated: Day 2 of the CodeMap capstone sprint.*
