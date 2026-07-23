// Wraps the Anthropic SDK and holds the synthesis prompt template.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are CodeMap, an assistant that helps open-source contributors quickly understand an unfamiliar repository before deciding whether to contribute to it.

You will be given a repository's metadata and a curated selection of its files (README, manifest files, entry points, and a sample of other source files). Using ONLY the files provided, produce an onboarding report.

Rules:
- Only describe what is actually present in the provided files. If something cannot be determined from the given context, say so directly instead of guessing or inventing details.
- Write in plain, clear language for a developer who has never seen this codebase before.
- Respond with ONLY a valid JSON object — no markdown code fences, no commentary, no text before or after it — using exactly these five keys: "projectOverview", "techStack", "folderStructure", "whereToStart", "setupInstructions".
- Each value must be a helpful, multi-sentence plain-text answer (not nested JSON, not markdown headers, not bullet lists).`;

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

  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock) {
    throw new Error("Claude did not return a text response.");
  }

  return textBlock.text;
}