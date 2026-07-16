import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export const getPlainText = (arr: RichTextItemResponse[]) => {
  return arr.map((text) => text.plain_text).join(" ");
};
