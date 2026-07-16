import type { NotionPageMeta } from "features/notion/model";
import { useRouteLoaderData } from "react-router";

export function useGlobalPList() {
  const pList = useRouteLoaderData("root") as NotionPageMeta[] | undefined;
  if (!pList) throw new Error("root loader 데이터가 없습니다");
  return pList;
}
