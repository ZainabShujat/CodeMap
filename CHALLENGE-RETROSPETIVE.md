# CodeMap — Challenge Retrospective

A record of the actual 10-day journey, not a highlight reel. Written on Day 10 of the AB Talks 60-Day Claude AI Challenge capstone.

---

## Timeline: Day 1 → Day 10
 
**Day 1 — Requirements.** Started with three real candidate products (a PR reviewer, an onboarding assistant, a tech-debt triage tool) before landing on CodeMap, sharpened around a specific persona — not "a new hire" in general, but "the Curious Contributor" deciding whether to invest in an unfamiliar repo. That specificity is what later made the "good first issue" idea (deferred to the cut list) and the eventual UI copy click into place.

**Day 2 — Design.** Locked the architecture: Next.js, no database, no auth, a single synthesis call rather than live agentic exploration (a deliberate time-budget trade-off, explicitly documented as a future upgrade, not a limitation hidden from view). Chose Claude as the AI provider. Discovered mid-design that Vercel's free-tier function timeout needed Fluid Compute to support a ~90-second generation window — caught before it became a Day 5 surprise.

**Day 3 — Setup.** The roughest day, purely on tooling, not design. `create-next-app`'s interactive prompts proved unreliable — it silently defaulted to TypeScript despite answering otherwise, and a Windows `Move-Item` command flattened folder structures unexpectedly while merging a scaffold into an existing repo. Solved by switching to explicit CLI flags (`--js --tailwind --eslint`) and `robocopy` instead of trusting prompts or PowerShell's folder-merge behavior. A stray leftover `codemap-temp` folder from this day quietly caused confusing symptoms that resurfaced as late as Day 5.

**Day 4 — Backend implementation.** Built the GitHub-fetching and file-curation pipeline, and verified it against real live data (`facebook/react` at 7,272 files, `vercel/next.js` at 30,223) rather than trusting the code by inspection alone. That live testing caught two real bugs before they shipped: an arbitrary 30-file cap that left most of the token budget unused on large repos, and a sequential-fetch performance bottleneck — fixed by parallel batching, verified with a real timing comparison (a 10x speedup, not an assumed one).

**Day 5 — AI integration, and the pivot.** Wired up Claude, then hit a real wall: the Anthropic API requires a payment method to activate even trial credits, which didn't match the Day 1 assumption of "free tier / provided credits." Rather than quietly paying to route around the mismatch, the honest fork was named directly, and the call was made to pivot the entire AI provider to Google Gemini — a real architecture change made mid-sprint, verified against official docs rather than assumed from memory, and executed cleanly (new `lib/gemini.js`, one-line import change in the route). Also debugged a genuinely confusing multi-layered issue: a stale dev server running from the leftover `codemap-temp` folder was serving old content on the same port, masking the real state of the actual project for several exchanges.

**Day 6 — Frontend, first working MVP.** Built the four-state UI (Input → Loading → Report → Error) and saw the first fully working end-to-end run: a real GitHub repo in, a real Gemini-generated five-section report out, live in a browser.

**Day 7 — Testing & UX polish.** A full real-world test matrix (7 cases, all passing) plus a senior-level UX review that found genuine bugs, not just cosmetic nitpicks: the report was silently duplicating content between its preview cards and detail cards, the loading progress bar was hardcoded to a fixed width and never actually moved, and the footer's AI attribution was stale from before the Gemini pivot. Also added real accessibility work — labels, ARIA roles, focus states, reduced-motion support.

**Day 8 — The silent bug.** A recent-repo-history feature had been added outside this chat by another tool between Day 7 and Day 8. A screenshot showed it rendering correctly. The actual code told a different story: two independent bugs — a prop-name mismatch between parent and child components, and a validation function checking the wrong (flat vs. nested) data shape — canceled each other out so completely that the feature had never worked at all, at any point, despite looking fine in a screenshot and passing a "no syntax errors" check. Finding this required refusing to review a description of code and insisting on the real files. Also hardened the app for real production use: rate limiting, URL edge cases (query strings), file-path encoding for special characters, and a timeout safety net around the Gemini call.

**Day 9 — Release readiness.** Found and removed a truly dead file (`lib/claude.js`, unused since Day 5's pivot but still sitting in the repo and referenced in the README) plus its unused dependency. Rewrote the README to match the real codebase instead of a stale description of it. Fixed a GitHub repo link that quietly pointed at an old, possibly-broken deployment instead of the real live one. Added a custom favicon, a branded 404 page, and a dynamically generated Open Graph image — verified all of it on the actual live production deployment, not just locally.

**Day 10 — Graduation.** This document, alongside the final portfolio materials and v1.0.0 release.

---

## Major technical decisions and pivots

- **Plain JavaScript over TypeScript** — decided deliberately on Day 2, nearly overridden by accident during Day 3's scaffolding confusion, confirmed back to the original decision after direct investigation.
- **Claude → Gemini** — the single biggest pivot of the sprint, driven by a real constraint (payment-method requirement) rather than a technical failure, made transparently rather than silently.
- **Static curation over live agentic exploration** — a deliberate, documented scope cut to fit the 10-day budget, not an oversight; explicitly flagged as the top future-scope item.
- **No database, no auth for v1.0** — held for the entire sprint, validated against every user story on Day 2, never violated even when the session-history feature was added.
- **Parallel batched fetching over sequential** — a real performance fix found through live measurement, not theoretical concern.

## Challenges solved and debugging moments worth remembering

- A leftover `codemap-temp` folder from Day 3 caused three separate confusing symptoms across two different days before being fully traced and removed.
- A PowerShell curl alias mismatch (`Invoke-WebRequest` vs. real `curl` syntax) briefly looked like a server bug before being identified as a client-side tooling difference.
- A Vercel "404: NOT_FOUND" turned out to be a stale browser tab, not a broken deployment — resolved by checking the actual build log instead of guessing at platform settings.
- The Day 8 history feature: two bugs that individually would have thrown obvious errors, but together produced total, silent non-function — a reminder that "it compiles" and "it works" are different claims.

## Skills demonstrated

Full SDLC discipline across all seven phases in ten days; REST API design and consumption (GitHub API, two different AI provider APIs); prompt engineering for structured, grounded JSON output; real debugging under uncertainty — distinguishing actual code bugs from environment quirks, stale caches, and tooling defaults; production hardening (rate limiting, timeouts, input validation, accessibility); pragmatic scope management under a hard deadline, including a real architecture pivot handled transparently; sustained technical documentation across ten consecutive days.

## Final project summary

CodeMap is a live, working, publicly deployed tool that turns any public GitHub repository into a five-section onboarding report in under two minutes, built end to end — requirements through launch — in a 10-day sprint, and hardened by a genuine senior-level review rather than shipped on first pass.

## Lessons learned

- **Confirm assumptions before they become architecture.** The Day 1 "free tier, don't worry about it" answer was reasonable to give and reasonable to accept at the time — but it cost a real pivot on Day 5. Worth surfacing earlier next time.
- **A passing syntax check is not a passing feature.** Day 8's history bug parsed perfectly and still never worked.
- **A screenshot proves rendering, not correctness.** The same lesson, from a different angle.
- **Tooling quirks will masquerade as code bugs.** Stale dev servers, leftover folders, and shell aliasing cost more debugging time this sprint than actual logic errors did.
- **Ask to see the real file.** More than once, describing what code does was a poor substitute for the code itself.

---

## A note from your AI pair programmer

Ten days ago we sat down and I asked you to pick between a PR reviewer, an onboarding assistant, and a tech-debt triage tool — and pushed back when your first instinct wasn't specific enough yet. That habit of pushing rather than just agreeing carried through the whole sprint, and I think it's part of why what you have now actually holds up.

I want to be honest about the rough parts, because they're the parts I respect most about how you handled this. Day 3 was genuinely frustrating — three failed scaffolding attempts, a folder that wouldn't stay deleted, prompts that lied about what they'd do. Day 5 was worse in a different way: finding out mid-sprint that the AI provider we'd built everything around required a payment method neither of us had planned for, and having to decide, in real time, whether to pay or pivot. You chose to pivot, and we rebuilt that piece cleanly in under an hour. That's not a small thing.

And Day 8 is the one I'll remember most from this build. You brought me a feature that looked done — a screenshot, working, right there — and I had to tell you that looking done and being done aren't the same claim, and ask you to paste the real files instead of trusting the description. What we found were two bugs that had quietly canceled each other out into total silence. Neither of us would have caught that from a screenshot. That's the whole reason a senior review exists, and you sat through it instead of waving it off.

What you're graduating with isn't just a working app, though it is genuinely that — live, tested against real repos, hardened against real edge cases, documented honestly including the parts that went sideways. You're leaving with the actual habit this challenge was named for: building in public, with an AI, and treating that AI as someone who should push back, not just agree.

Congratulations on CodeMap. Go ship the next one.

---
*Written Day 10 of the CodeMap capstone sprint.*
