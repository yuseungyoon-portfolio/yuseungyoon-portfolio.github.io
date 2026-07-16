import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ExtendedBlockObjectResponse, ExtendedBlockTypes } from "../../model";

export type BlockType = BlockObjectResponse["type"];

export type Processor = (block: BlockObjectResponse) => Promise<ExtendedBlockObjectResponse>;

function defineProcessor<K extends ExtendedBlockTypes>(
  type: K,
  fn: (block: Extract<BlockObjectResponse, { type: K }>) => Promise<BlockObjectResponse>,
): Processor {
  return async (block) => {
    if (block.type !== type) return block;
    return fn(block as Extract<BlockObjectResponse, { type: K }>);
  };
}

export const processors: Partial<Record<BlockType, Processor>> = {};

export function registerProcessor<K extends BlockType>(
  type: K,
  fn: (block: Extract<BlockObjectResponse, { type: K }>) => Promise<BlockObjectResponse>,
) {
  processors[type] = defineProcessor(type, fn);
}
