// 빌드 중 Notion 데이터 접근 계층.
//
// 프리렌더는 페이지마다 root/page loader를 (HTML, .data 각각) 다시 실행하기 때문에
// loader에서 직접 Notion API를 부르면 호출 수가 페이지 수에 비례해 폭증하고 rate limit(초당 3회)에 걸린다.
// 그래서 scripts/fetchNotion.ts가 빌드 전에 한 번만 API를 호출해 스냅샷(JSON)을 만들고,
// loader/config/스크립트는 아래 get* 함수로 그 스냅샷만 읽는다.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import pMap from "p-map";
import type { NotionPageMeta, TraversableBlock } from "../model";
import { getNotionClient } from "./client.server";
import { processBlock } from "./processBlock";

export type NotionSnapshot = {
  fetchedAt: string;
  pList: [NotionPageMeta[], NotionPageMeta[]];
  description: RichTextItemResponse[];
  posts: Record<string, TraversableBlock[]>;
};

export const SNAPSHOT_PATH = path.join(process.cwd(), ".notion-cache", "snapshot.json");

// ---------------------------------------------------------------------------
// Notion API fetch (scripts/fetchNotion.ts 전용)
// ---------------------------------------------------------------------------

const getChildrenBlocks = async (
  client: Client,
  parent_block_id: string,
): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> => {
  const results: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.blocks.children.list({
      block_id: parent_block_id,
      start_cursor: cursor,
      page_size: 100,
    });
    results.push(...res.results);
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return results;
};

// 요청 속도는 client의 rate limiter가 제어하므로 여기서는 병렬로 걸어도 된다.
const getDepthChildrenBlocks = async (
  client: Client,
  blocks: BlockObjectResponse[],
): Promise<BlockObjectResponse[]> => {
  await Promise.all(
    blocks.map(async (b) => {
      if (!b.has_children) return;
      const children = await getChildrenBlocks(client, b.id);
      const resolved = await getDepthChildrenBlocks(client, children as BlockObjectResponse[]);
      const content = (b as any)[b.type] ?? ((b as any)[b.type] = {});
      content.children = resolved;
    }),
  );
  return blocks;
};

const fetchPost = async (client: Client, post_id: string) => {
  const blocks = await getChildrenBlocks(client, post_id);
  const rawBlocks = await getDepthChildrenBlocks(client, blocks as BlockObjectResponse[]);
  return await processBlock(rawBlocks);
};

export async function fetchSnapshot(key: string, database_id: string): Promise<NotionSnapshot> {
  const client = getNotionClient(key);
  const db = (await client.databases.retrieve({ database_id })) as DatabaseObjectResponse;
  const data_source_id = db.data_sources[0]?.id ?? "";

  const all: NotionPageMeta[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.dataSources.query({
      data_source_id,
      sorts: [{ property: "기간", direction: "descending" }],
      start_cursor: cursor,
    });
    all.push(...(res.results as NotionPageMeta[]));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  const isFreelance = (p: NotionPageMeta) =>
    p.properties["구분"].multi_select.some((option) => option.name === "프리랜스");

  const posts: NotionSnapshot["posts"] = {};
  await pMap(
    all,
    async (p, i) => {
      posts[p.id] = await fetchPost(client, p.id);
      console.log(`NOTION POST ${i + 1}/${all.length} fetched`);
    },
    { concurrency: 3 },
  );

  return {
    fetchedAt: new Date().toISOString(),
    pList: [all.filter(isFreelance), all.filter((p) => !isFreelance(p))],
    description: db.description,
    posts,
  };
}

// ---------------------------------------------------------------------------
// 스냅샷 읽기 (loader, react-router.config, 빌드 스크립트)
// ---------------------------------------------------------------------------

let snapshot: NotionSnapshot | undefined;
const loadSnapshot = (): NotionSnapshot => {
  if (snapshot) return snapshot;
  if (!existsSync(SNAPSHOT_PATH)) {
    throw new Error(
      `Notion 스냅샷이 없습니다 (${SNAPSHOT_PATH}). 먼저 \`bun run notion:fetch\`를 실행하세요.`,
    );
  }
  snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8")) as NotionSnapshot;
  return snapshot;
};

export const getPList = async () => loadSnapshot().pList;

export const getDbDescription = async () => loadSnapshot().description;

export const getFullPost = async (post_id: string) => {
  const post = loadSnapshot().posts[post_id];
  if (!post) throw new Error(`Notion 스냅샷에 포스트가 없습니다: ${post_id}`);
  return post;
};
