import type { ComponentType } from "react";
import type { ExtendedBlockTypes, TransformedNotionBlocks } from "./unions";

export type TransformedNotionBlock<T extends ExtendedBlockTypes> = Extract<
  TransformedNotionBlocks,
  { type: T }
>;

export type NotionComponentProps<T extends ExtendedBlockTypes> = {
  block: TransformedNotionBlock<T>;
};

export type NotionBlockComponent<T extends ExtendedBlockTypes> = ComponentType<
  NotionComponentProps<T>
>;
