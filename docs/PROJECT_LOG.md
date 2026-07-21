# CodeMap — Project Log

A running record of what happened each day of the capstone sprint. Updated at the end of every day.

---

## Day 1 — Requirements

**Phase:** Requirements

**What happened:**
- Interviewed through several candidate product ideas (PR reviewer, onboarding assistant, tech-debt triage) and landed on **CodeMap** — an AI-generated onboarding report for open-source contributors evaluating an unfamiliar repository.
- Defined the target persona ("The Curious Contributor"), the core loop, user stories, functional and non-functional requirements, constraints, risks, a cut list, and the v1.0 scope.
- Defined the 2-minute success test: paste a public JS/Python repo URL, wait under ~90 seconds, get a clear onboarding report.
- Generated: `CodeMap_PRD.docx`, `CodeMap_Sprint_Workbook.docx` (Days 2–10), `CodeMap_Pitch_Deck.pptx`.

**Decisions made:**
- Public repos only (JS/Python) for v1.0 — no private repo/auth support.
- Static, token-budgeted file curation instead of a live agentic exploration loop, to fit the 10-day timeline.
- "Good first issue" → file mapping and a visual architecture diagram are stretch goals, cut first if time runs short.

---

## Day 2 — Design

**Phase:** Design

**What happened:**
- Created the GitHub repository (`codemap`), cloned it locally, set up an initial `docs/` folder.
- Finalized the full tech stack: Next.js (App Router, JavaScript) + Tailwind, Anthropic Claude API (`claude-sonnet-5`) via `@anthropic-ai/sdk`, GitHub REST API via native `fetch`, no database, no auth, hosted on Vercel (Hobby, Fluid Compute enabled).
- Verified current Vercel Hobby function-timeout limits before locking hosting — confirmed Fluid Compute (still free) raises the ceiling to 300 seconds, comfortably covering the ~90-second target.
- Designed the full system architecture: component diagram, request lifecycle sequence diagram, and the AI interaction pattern (single synthesis call, structured JSON output, groundedness instruction).
- Confirmed no database is needed for v1.0, validated against every user story.
- Designed the two required API endpoints (`POST /api/generate`, `GET /api/health`) including validation rules and error cases.
- Designed the complete user flow (Input → Loading → Report → Error) and low-fidelity wireframes for all four states.
- Designed the full project folder structure.
- Updated the Sprint Workbook's Day 3 section to reflect that the tech stack is now decided, shifting Day 3 from "decide" to "execute" tasks.

**Decisions made:**
- No TypeScript in v1.0 — plain JavaScript, to avoid a learning-curve tax on a tight timeline.
- Claude's synthesis response will be structured JSON (fixed keys per section), not freeform markdown, to make parsing deterministic.
- Token budget for curated files is a deliberate cost/latency control, not a workaround for a model limitation (Claude Sonnet 5 supports a 1M-token context window).

**Generated:** `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md`, updated `CodeMap_Sprint_Workbook.docx`.

**Day 3 readiness:** On track. No unnecessary scope added. Tomorrow starts implementation immediately.

---
