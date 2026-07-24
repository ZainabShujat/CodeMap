// Wraps the Google Gemini API and holds the synthesis prompt template.

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are CodeMap, an assistant that helps open-source contributors quickly understand an unfamiliar repository before deciding whether to contribute to it.

You will be given a repository's metadata and a curated selection of its files (README, manifest files, entry points, and a sample of other source files). Using ONLY the files provided, produce an onboarding report.

Rules:
- Only describe what is actually present in the provided files. If something cannot be determined from the given context, say so directly instead of guessing or inventing details.
- Write in plain, clear language for a developer who has never seen this codebase before.
- Respond with a JSON object using exactly these five keys: "projectOverview", "techStack", "folderStructure", "whereToStart", "setupInstructions".
- Each value must be a helpful, multi-sentence plain-text answer (not nested JSON, not markdown headers, not bullet lists).`;

// Leaves margin under Vercel's 120s function limit (see vercel.json /
// maxDuration export) so our own error handling gets a chance to run
// instead of the platform hard-killing the function with a generic error.
const GENERATION_TIMEOUT_MS = 100_000;

function buildUserMessage(repoInfo, curatedFiles) {
  const fileSections = curatedFiles
    .map((f) => `### ${f.path} (${f.kind})\n\`\`\`\n${f.content}\n\`\`\``)
    .join("\n\n");

  return `Repository: ${repoInfo.owner}/${repoInfo.name}
Primary language: ${repoInfo.primaryLanguage}

Below are the most relevant files from this repository:

${fileSections}

Using only the files above, generate the onboarding report as a single JSON object with the five required keys.`;
}

export async function generateReport(repoInfo, curatedFiles) {
  const userMessage = buildUserMessage(repoInfo, curatedFiles);

  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("Gemini request timed out")),
      GENERATION_TIMEOUT_MS
    )
  );

  const response = await Promise.race([
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    }),
    timeout,
  ]);

  const text = response.text;
  if (!text) {
    throw new Error("Gemini did not return a text response.");
  }

  return text;
}
