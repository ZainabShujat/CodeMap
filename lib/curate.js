// Selects README, manifest, entry points, and token-budgeted sampled files.
// Fetches file contents in parallel batches to stay within the ~90s generation target.

import { getFileContent } from "@/lib/github";

const MAX_BUDGET_CHARS = 400000; // ~100k tokens — a deliberate cost/latency control, not a model limit
const MAX_CANDIDATES = 120;      // safety valve on total fetch attempts, not the primary constraint
const BATCH_SIZE = 10;           // concurrent file-content fetches per batch

const README_PATTERN = /^readme(\.[a-z]+)?$/i;
const MANIFEST_FILES = [
  "package.json",
  "requirements.txt",
  "pyproject.toml",
  "setup.py",
  "pipfile",
  "pom.xml",
  "build.gradle",
  "composer.json",
];
const ENTRY_POINT_PATTERN =
  /(^|\/)(index|main|app|server)\.(js|jsx|ts|tsx|py)$/i;

const EXCLUDE_DIR_PATTERN =
  /(^|\/)(node_modules|\.git|dist|build|vendor|__pycache__|\.next|coverage|venv|\.venv|\.cache)(\/|$)/i;
const EXCLUDE_FILE_PATTERN =
  /\.(lock|min\.js|min\.css|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|pdf|zip|tar|gz|mp4|mp3|wasm|map|bin)$/i;
const LOCK_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "poetry.lock",
  "gemfile.lock",
];

function basename(path) {
  return path.split("/").pop().toLowerCase();
}

function isExcluded(path) {
  const name = basename(path);
  if (EXCLUDE_DIR_PATTERN.test(path)) return true;
  if (EXCLUDE_FILE_PATTERN.test(path)) return true;
  if (LOCK_FILES.includes(name)) return true;
  return false;
}

function classify(path) {
  const name = basename(path);
  if (README_PATTERN.test(name)) return "readme";
  if (MANIFEST_FILES.includes(name)) return "manifest";
  if (ENTRY_POINT_PATTERN.test(path)) return "entry";
  return "other";
}

async function fetchInBatches(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(...(await Promise.all(batch.map(fn))));
  }
  return results;
}

export async function curateFiles(owner, repo, branch, allFiles) {
  const candidates = allFiles.filter((f) => !isExcluded(f.path));

  const priority = [];
  const rest = [];

  for (const file of candidates) {
    const kind = classify(file.path);
    if (kind === "other") {
      rest.push(file);
    } else {
      priority.push({ ...file, kind });
    }
  }

  // Smallest-first for the non-essential pool — cheap context first.
  rest.sort((a, b) => a.size - b.size);

  // Essential files (readme/manifest/entry) always come first in fetch order,
  // guaranteeing they're included regardless of budget. MAX_CANDIDATES is a
  // safety valve on total fetch attempts, not the real constraint.
  const orderedCandidates = [...priority, ...rest].slice(0, MAX_CANDIDATES);

  const fetched = await fetchInBatches(
    orderedCandidates,
    BATCH_SIZE,
    async (file) => {
      const result = await getFileContent(owner, repo, branch, file.path);
      return { ...file, content: result.ok ? result.content : null };
    }
  );

  let budgetUsed = 0;
  const curated = [];
  const filesExcludedByBudget = [];

  for (const file of fetched) {
    if (file.content === null) continue; // fetch failed, skip silently

    const isEssential =
      file.kind === "readme" || file.kind === "manifest" || file.kind === "entry";

    if (!isEssential && budgetUsed + file.content.length > MAX_BUDGET_CHARS) {
      filesExcludedByBudget.push(file.path);
      continue;
    }

    curated.push({
      path: file.path,
      kind: isEssential ? file.kind : "sampled",
      content: file.content,
    });
    budgetUsed += file.content.length;
  }

  return {
    files: curated,
    meta: {
      filesConsidered: allFiles.length,
      filesExcluded: allFiles.length - candidates.length,
      filesAnalyzed: curated.length,
      approxCharsUsed: budgetUsed,
      filesExcludedByBudget: filesExcludedByBudget.length,
    },
  };
}