import { getFreshImageUrl } from "features/notion/api/index.server";
import type { Route } from "./+types/image";

export async function loader({ params }: Route.LoaderArgs) {
  const url = await getFreshImageUrl(process.env.NOTION_KEY!, params.blockId);
  if (!url) throw new Response("Not Found", { status: 404 });
  return Response.json(
    { url },
    { headers: { "Cache-Control": "no-store" } },
  );
}
