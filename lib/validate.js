// Validates and normalizes submitted GitHub repo URLs.

const GITHUB_URL_PATTERN =
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]){0,38})\/([a-zA-Z0-9._-]+?)(?:\.git)?(?:\/.*)?\/?$/;

export function parseRepoUrl(input) {
  if (typeof input !== "string" || input.trim().length === 0) {
    return {
      valid: false,
      code: "INVALID_URL",
      message: "Please enter a GitHub repository URL.",
    };
  }

  const trimmed = input.trim();
  const match = trimmed.match(GITHUB_URL_PATTERN);

  if (!match) {
    return {
      valid: false,
      code: "INVALID_URL",
      message:
        "That doesn't look like a GitHub repository URL. It should look like https://github.com/owner/repo.",
    };
  }

  const [, owner, repo] = match;

  if (!owner || !repo) {
    return {
      valid: false,
      code: "INVALID_URL",
      message:
        "That doesn't look like a GitHub repository URL. It should look like https://github.com/owner/repo.",
    };
  }

  return {
    valid: true,
    owner,
    repo,
    normalizedUrl: `https://github.com/${owner}/${repo}`,
  };
}