import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PartialBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { cache } from "react";
import type { NotionPageMeta } from "../model";
import { processBlock } from "./processBlock";

const getChildrenBlocks = async (
  client: Client,
  parent_block_id: string,
): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> => {
  const results: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];

  let res = await client.blocks.children.list({
    block_id: parent_block_id,
    page_size: 100,
  });
  results.push(...res.results);

  while (res.has_more) {
    const cursor = res.next_cursor;
    if (!cursor) break;
    res = await client.blocks.children.list({
      block_id: parent_block_id,
      start_cursor: cursor,
      page_size: 100,
    });
    results.push(...res.results);
  }
  return results;
};

const getDepthChildrenBlocks = async (
  client: Client,
  blocks: BlockObjectResponse[],
): Promise<BlockObjectResponse[]> => {
  return await Promise.all(
    blocks.map(async (b) => {
      if (!b.has_children) return b;
      const children = await getChildrenBlocks(client, b.id);
      const resolved = await getDepthChildrenBlocks(
        client,
        children as BlockObjectResponse[],
      );
      const type = b.type;
      const content = (b as any)[type] ?? ((b as any)[type] = {});
      content.children = resolved;
      return b;
    }),
  );
};

const withRetry = async <T>(fn: () => Promise<T>, attempts = 3): Promise<T> => {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      console.error(`NOTION FETCH RETRY (${i + 1}/${attempts})`, err);
    }
  }
  throw lastErr;
};

async function fetchPList(
  key: string,
  database_id: string,
): Promise<[NotionPageMeta[], NotionPageMeta[]]> {
  const client = new Client({ auth: key });
  const db = (await withRetry(() =>
    client.databases.retrieve({ database_id }),
  )) as DatabaseObjectResponse;
  const data_source_id = db.data_sources[0]?.id ?? "";

  const response = await withRetry(() =>
    client.dataSources.query({
      data_source_id,
      sorts: [{ property: "기간", direction: "descending" }],
    }),
  );

  const pList = response.results as NotionPageMeta[];
  const isFreelance = (p: NotionPageMeta) =>
    p.properties["구분"].multi_select.some(
      (option) => option.name === "프리랜스",
    );
  return [pList.filter(isFreelance), pList.filter((p) => !isFreelance(p))];
}
export const getPList = cache(fetchPList);

async function postdata(key: string, post_id: string) {
  const client = new Client({ auth: key });
  const blocks = await getChildrenBlocks(client, post_id);
  const rawBlocks = await getDepthChildrenBlocks(
    client,
    blocks as BlockObjectResponse[],
  );
  return await processBlock(rawBlocks);
}
export const getFullPost = cache(postdata);

async function fetchDbDescription(
  key: string,
  database_id: string,
): Promise<RichTextItemResponse[]> {
  const client = new Client({ auth: key });
  const db = (await client.databases.retrieve({
    database_id,
  })) as DatabaseObjectResponse;
  return db.description;
}
export const getDbDescription = cache(fetchDbDescription);
