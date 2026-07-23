import { parseRepoUrl } from "@/lib/validate";
import { getRepoMetadata, getFileTree } from "@/lib/github";
import { curateFiles } from "@/lib/curate";
import { generateReport } from "@/lib/gemini";
import { parseReportResponse } from "@/lib/parseReport";

export const maxDuration = 120;

// Best-effort in-memory rate limiter. Note: on Vercel's serverless platform,
// each function instance has its own memory and instances can be recycled
// at any time, so this is a soft deterrent against casual abuse, not a hard
// guarantee. A durable limit would need an external store (e.g. Upstash
// Redis), which is out of scope for this project's free-tier setup — but
// this still meaningfully protects against a single script hammering the
// endpoint within one warm instance.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestLog = new Map();

function isRateLimitedByIp(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (isRateLimitedByIp(ip)) {
    return Response.json(
      {
        status: "error",
        code: "RATE_LIMITED",
        message: "Too many requests right now — try again in a minute.",
      },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { status: "error", code: "INVALID_URL", message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = parseRepoUrl(body.repoUrl);
  if (!parsed.valid) {
    return Response.json(
      { status: "error", code: parsed.code, message: parsed.message },
      { status: 400 }
    );
  }

  const metadata = await getRepoMetadata(parsed.owner, parsed.repo);
  if (!metadata.ok) {
    const status = metadata.code === "RATE_LIMITED" ? 429 : 404;
    return Response.json(
      { status: "error", code: metadata.code, message: metadata.message },
      { status }
    );
  }

  const tree = await getFileTree(parsed.owner, parsed.repo, metadata.defaultBranch);
  if (!tree.ok) {
    const status = tree.code === "RATE_LIMITED" ? 429 : 500;
    return Response.json(
      { status: "error", code: tree.code, message: tree.message },
      { status }
    );
  }

  const curated = await curateFiles(
    parsed.owner,
    parsed.repo,
    metadata.defaultBranch,
    tree.files
  );

  let rawReport;
  try {
    rawReport = await generateReport(
      {
        owner: metadata.owner,
        name: metadata.repo,
        primaryLanguage: metadata.primaryLanguage,
      },
      curated.files
    );
  } catch (err) {
    console.error("Gemini generation failed:", err);
    return Response.json(
      {
        status: "error",
        code: "GENERATION_TIMEOUT",
        message: "This repo is taking longer than expected. Try again, or try a smaller repo.",
        debugMessage: err.message,
      },
      { status: 504 }
    );
  }

  let sections;
  try {
    sections = parseReportResponse(rawReport);
  } catch {
    return Response.json(
      {
        status: "error",
        code: "INTERNAL_ERROR",
        message: "Something went wrong generating the report. Try again.",
      },
      { status: 500 }
    );
  }

  return Response.json({
    status: "success",
    repo: {
      owner: metadata.owner,
      name: metadata.repo,
      primaryLanguage: metadata.primaryLanguage,
      supportedLanguage: metadata.supportedLanguage,
    },
    sections,
    meta: {
      filesAnalyzed: curated.meta.filesAnalyzed,
      approxCharsUsed: curated.meta.approxCharsUsed,
    },
  });
}
