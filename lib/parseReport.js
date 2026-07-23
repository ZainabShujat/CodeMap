// Parses the model's JSON response into the 5 report sections.

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

  // The model occasionally wraps JSON in markdown code fences despite instructions not to.
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Could not parse the model's response as JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("The model's response was not in the expected shape.");
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