import { parseRepoUrl } from "@/lib/validate";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") || "";
  const result = parseRepoUrl(url);
  return Response.json(result);
}