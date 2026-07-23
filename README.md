# CodeMap

CodeMap turns a public GitHub repository into a concise onboarding report. Paste a repo URL, wait for the analysis to finish, and get a structured summary of the project overview, tech stack, folder structure, where to start reading, and setup instructions.

The app is built with Next.js and focuses on giving developers a fast first-pass understanding of an unfamiliar codebase without having to read every file manually.

## What it does

- Accepts a public GitHub repository URL from the homepage.
- Fetches repository metadata and the file tree from GitHub.
- Curates the most relevant files for analysis.
- Sends the curated context to the AI generation pipeline.
- Renders the resulting report in a clean, readable interface.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- GitHub REST API
- Google Gemini for report generation
- Anthropic SDK support in the codebase for related synthesis helpers
- Zod for validation

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A GitHub personal access token for higher API limits
- A Gemini API key

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a local environment file named `.env.local` in the project root and add:

```bash
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
```

If you work on the Anthropic-based helper paths in `lib/claude.js`, also set `ANTHROPIC_API_KEY`.

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run start` runs the production build locally.
- `npm run lint` checks the codebase with ESLint.

## How the request flow works

1. The homepage accepts a GitHub repository URL.
2. The app validates and normalizes the URL.
3. The server route fetches repo metadata and the file tree from GitHub.
4. Relevant files are curated into a smaller context window.
5. The AI model generates a JSON report.
6. The UI renders the report as a readable repository map.

## Project Structure

- `app/` contains the Next.js routes, pages, and API handlers.
- `components/` contains the UI pieces for the input form, loading state, errors, and report display.
- `lib/` contains GitHub access, curation, parsing, validation, and AI helper logic.
- `docs/` contains architecture, API, schema, and project notes.

## Limitations

- The app is designed for public repositories.
- GitHub API limits can affect request volume if no token is configured.
- Primary support is for JavaScript, TypeScript, and Python repositories.
- Large repositories may take longer to process or may hit the generation timeout.

## Contributing

This project is intentionally small and opinionated. If you extend it, keep the UI simple, keep the API surface narrow, and preserve the repository-map workflow as the core experience.
