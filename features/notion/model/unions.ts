import type { BlockObjectResponse } from "@notionhq/client";
import type {
  ExtendedBookmarkObjectResponse,
  ExtendedCalloutBlockObjectResponse,
  ExtendedImageBlockObjectResponse,
  GroupedBulletedListItemResponse,
  GroupedNumberedListItemResponse,
} from "./blocks";

export type ExtendedBlockObjectResponse =
  | BlockObjectResponse
  | GroupedBulletedListItemResponse
  | GroupedNumberedListItemResponse;
export type ExtendedBlockTypes = ExtendedBlockObjectResponse["type"];
export type NotionBlock<T extends ExtendedBlockTypes> = Extract<
  ExtendedBlockObjectResponse,
  { type: T }
>;

type ExcludedNotionBlocks = Exclude<
  ExtendedBlockObjectResponse,
  { type: "bookmark" } | { type: "image" } | { type: "callout" }
>;
export type TransformedNotionBlocks =
  | ExcludedNotionBlocks
  | ExtendedBookmarkObjectResponse
  | ExtendedCalloutBlockObjectResponse
  | ExtendedImageBlockObjectResponse
  | GroupedBulletedListItemResponse
  | GroupedNumberedListItemResponse
  | WithChildren<NotionBlock<"numbered_list_item">>
  | WithChildren<NotionBlock<"grouped_numbered_list_item">>
  | WithChildren<NotionBlock<"grouped_bulleted_list_item">>
  | WithChildren<NotionBlock<"bulleted_list_item">>
  | WithChildren<NotionBlock<"paragraph">>
  | WithChildren<NotionBlock<"table">>
  | WithChildren<NotionBlock<"table_of_contents">>
  | WithChildren<NotionBlock<"quote">>
  | WithChildren<NotionBlock<"toggle">>
  | WithChildren<NotionBlock<"column_list">>
  | WithChildren<NotionBlock<"column">>;

export type TraversableBlock = TransformedNotionBlocks;

export type WithChildren<T extends ExtendedBlockObjectResponse> = T & {
  has_children: true;
} & {
  [K in keyof T]: K extends T["type"] ? T[K] & { children: TraversableBlock[] } : T[K];
};
