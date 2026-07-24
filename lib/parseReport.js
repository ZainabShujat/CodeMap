// Parses Gemini's JSON response into the 5 report sections.

const REQUIRED_KEYS = [
  "projectOverview",
  "techStack",
  "folderStructure",
  "whereToStart",
  "setupInstructions",
];

const FALLBACK_TEXT =
  "Not enough information was found in the provided files to answer this.";

export function parseReportResponse(rawText) {
  let cleaned = rawText.trim();

  // Gemini occasionally wraps JSON in markdown code fences despite instructions not to.
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Could not parse Gemini's response as JSON.");
  }

  // Defensive check: valid JSON can still be null, an array, or a primitive
  // (e.g. a bare string or number) rather than the object we expect. Treat
  // any of those the same as a parse failure instead of crashing below.
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Gemini's response was not a valid JSON object.");
  }

  const sections = {};
  for (const key of REQUIRED_KEYS) {
    sections[key] =
      typeof parsed[key] === "string" && parsed[key].trim().length > 0
        ? parsed[key].trim()
        : FALLBACK_TEXT;
  }

  return sections;
}
