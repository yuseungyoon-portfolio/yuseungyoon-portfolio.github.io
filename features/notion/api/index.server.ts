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
      const resolved = await getDepthChildrenBlocks(client, children as BlockObjectResponse[]);
      const type = b.type;
      const content = (b as any)[type] ?? ((b as any)[type] = {});
      content.children = resolved;
      return b;
    }),
  );
};

async function fetchPList(key: string, database_id: string): Promise<NotionPageMeta[]> {
  const client = new Client({ auth: key });
  const db = (await client.databases.retrieve({ database_id })) as DatabaseObjectResponse;
  const data_source_id = db.data_sources[0]?.id ?? "";

  try {
    const response = await client.dataSources.query({
      data_source_id,
      sorts: [{ property: "기간", direction: "descending" }],
    });
    return response.results as NotionPageMeta[];
  } catch (err) {
    console.error("\n", data_source_id, err, "\n", "PLIST FETCH ERROR");
    return [];
  }
}
export const getPList = cache(fetchPList);

async function postdata(key: string, post_id: string) {
  const client = new Client({ auth: key });
  const blocks = await getChildrenBlocks(client, post_id);
  const rawBlocks = await getDepthChildrenBlocks(client, blocks as BlockObjectResponse[]);
  return await processBlock(rawBlocks);
}
export const getFullPost = cache(postdata);

async function fetchDbDescription(
  key: string,
  database_id: string,
): Promise<RichTextItemResponse[]> {
  const client = new Client({ auth: key });
  const db = (await client.databases.retrieve({ database_id })) as DatabaseObjectResponse;
  return db.description;
}
export const getDbDescription = cache(fetchDbDescription);
