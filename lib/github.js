// Fetches repo metadata, file tree, and file contents from the GitHub REST API.

const GITHUB_API = "https://api.github.com";

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function isRateLimited(response) {
  return (
    response.status === 403 &&
    response.headers.get("x-ratelimit-remaining") === "0"
  );
}

export async function getRepoMetadata(owner, repo) {
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: authHeaders(),
  });

  if (isRateLimited(response)) {
    return {
      ok: false,
      code: "RATE_LIMITED",
      message: "Too many requests right now — try again in a minute.",
    };
  }

  if (response.status === 404) {
    return {
      ok: false,
      code: "REPO_NOT_ACCESSIBLE",
      message: "We can't reach that repository. Make sure it's public.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: `GitHub returned an unexpected error (status ${response.status}).`,
    };
  }

  const data = await response.json();

  if (data.private) {
    return {
      ok: false,
      code: "REPO_NOT_ACCESSIBLE",
      message: "We can't reach that repository. Make sure it's public.",
    };
  }

  const SUPPORTED_LANGUAGES = ["JavaScript", "TypeScript", "Python"];
  const primaryLanguage = data.language || "Unknown";

  return {
    ok: true,
    owner,
    repo,
    defaultBranch: data.default_branch,
    description: data.description || "",
    primaryLanguage,
    supportedLanguage: SUPPORTED_LANGUAGES.includes(primaryLanguage),
    stars: data.stargazers_count,
  };
}

export async function getFileTree(owner, repo, branch) {
  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: authHeaders() }
  );

  if (isRateLimited(response)) {
    return {
      ok: false,
      code: "RATE_LIMITED",
      message: "Too many requests right now — try again in a minute.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: `GitHub returned an unexpected error fetching the file tree (status ${response.status}).`,
    };
  }

  const data = await response.json();

  const files = (data.tree || [])
    .filter((item) => item.type === "blob")
    .map((item) => ({ path: item.path, size: item.size || 0 }));

  return {
    ok: true,
    files,
    truncated: Boolean(data.truncated),
  };
}

export async function getFileContent(owner, repo, branch, path) {
  // Encode each path segment individually so slashes stay as directory
  // separators but spaces/special characters (e.g. "docs/Getting Started.md")
  // don't produce a malformed URL.
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const response = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`
  );

  if (!response.ok) {
    return { ok: false };
  }

  const content = await response.text();
  return { ok: true, content };
}