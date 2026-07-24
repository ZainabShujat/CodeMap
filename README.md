# CodeMap

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-2ea44f)](https://code-map-gamma.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)](https://ai.google.dev)

Turn a public GitHub repository into a clear, readable onboarding report — built for open-source contributors deciding whether to dive into an unfamiliar codebase.

Paste a repo URL, wait under about 90 seconds, and get back a structured breakdown: what the project does, its tech stack, how it's organized, where to start reading the code, and how to set it up locally.

**Live demo:** https://code-map-gamma.vercel.app

---

## What it does

- Accepts a public GitHub repository URL.
- Fetches the repo's metadata and file tree from GitHub.
- Curates the most relevant files (README, manifest, entry points, and a token-budgeted sample of other source files) within a fixed context budget.
- Sends the curated context to Google Gemini for analysis.
- Renders the result as a five-section report: Project Overview, Tech Stack, Folder Structure Explained, Where to Start Reading, and Setup Instructions.
- Remembers repos analyzed in the current browser session, so revisiting one is instant, with no re-generation cost.

## Tech stack

- Next.js 16 (App Router), plain JavaScript
- React 19
- Tailwind CSS 4
- GitHub REST API (via native `fetch`)
- Google Gemini (`gemini-2.5-flash`) for report generation
- Zod for lightweight validation
- Deployed on Vercel (Fluid Compute enabled, to support the ~90 second generation window)

No database and no authentication are used — every request is stateless end to end. Session history lives only in the browser (`sessionStorage`), never on a server.

## Getting started

### Prerequisites

- Node.js 18 or newer
- A GitHub personal access token (raises API rate limits from 60/hr to 5,000/hr — [create one here](https://github.com/settings/tokens?type=beta), scoped to "Public Repositories (read-only)")
- A free Google Gemini API key ([create one here](https://aistudio.google.com/apikey) — no card required)

### Install

```
npm install
```

### Configure environment variables

Create a `.env.local` file in the project root:

```
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
```

### Run locally

```
npm run dev
```

Open http://localhost:3000.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production build locally
- `npm run lint` — check the codebase with ESLint

## How a request flows

1. The homepage accepts a GitHub repository URL and validates its format client-side for instant feedback.
2. `POST /api/generate` re-validates the URL, then fetches repo metadata and its file tree from GitHub.
3. Files are curated within a fixed character budget — README, manifest, and entry-point files are always included; remaining budget is filled smallest-file-first.
4. The curated bundle is sent to Gemini in a single request, instructed to stay grounded in the provided files and return structured JSON.
5. The response is parsed into five fixed sections and rendered in the UI.

## Project structure

```
app/
  page.js                   — main UI; handles the input/loading/report/error states
  layout.js                 — root layout and page metadata
  components/                — RepoInputForm, LoadingState, ErrorBanner, ReportView
  api/
    generate/route.js        — the core POST endpoint
    health/route.js          — uptime check
lib/
  validate.js                 — GitHub URL validation/normalization
  github.js                   — GitHub REST API access (metadata, file tree, file contents)
  curate.js                   — file curation and token-budget logic
  gemini.js                   — Gemini API wrapper and synthesis prompt
  parseReport.js               — parses Gemini's response into report sections
docs/                          — architecture, schema, API design, and sprint planning notes
```

## Limitations

- Public repositories only — no private repo or authentication support.
- Full, tested language support is JavaScript and Python; other languages may still produce a result but aren't guaranteed to be as reliable.
- Very large repositories may take longer to process, up to the generation timeout.
- Session history is stored in the browser only and clears when the tab/session ends — it isn't a persistent account feature.

## License

MIT

---

Built as part of the AB Talks 60-Day Claude AI Challenge.
