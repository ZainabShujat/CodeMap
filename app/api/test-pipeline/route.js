import { parseRepoUrl } from "@/lib/validate";
import { getRepoMetadata, getFileTree } from "@/lib/github";
import { curateFiles } from "@/lib/curate";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url") || "";

  const parsed = parseRepoUrl(urlParam);
  if (!parsed.valid) {
    return Response.json(parsed, { status: 400 });
  }

  const metadata = await getRepoMetadata(parsed.owner, parsed.repo);
  if (!metadata.ok) {
    return Response.json(metadata, { status: 404 });
  }

  const tree = await getFileTree(
    parsed.owner,
    parsed.repo,
    metadata.defaultBranch
  );
  if (!tree.ok) {
    return Response.json(tree, { status: 500 });
  }

  const curated = await curateFiles(
    parsed.owner,
    parsed.repo,
    metadata.defaultBranch,
    tree.files
  );

  return Response.json({
    repo: {
      owner: metadata.owner,
      name: metadata.repo,
      primaryLanguage: metadata.primaryLanguage,
      supportedLanguage: metadata.supportedLanguage,
    },
    curation: curated.meta,
    curatedFiles: curated.files.map((f) => ({
      path: f.path,
      kind: f.kind,
      chars: f.content.length,
    })),
  });
}