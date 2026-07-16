import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { getHeadingId } from "../../lib";
import type { NotionComponentProps } from "../../model";

export function Heading_1({ block }: NotionComponentProps<"heading_1">) {
  const TITLE = block.heading_1.rich_text.map((txt: RichTextItemResponse) => txt.plain_text);
  return <h2 id={getHeadingId(block.heading_1.rich_text)}>{TITLE}</h2>;
}

export function Heading_2({ block }: NotionComponentProps<"heading_2">) {
  const TITLE = block.heading_2.rich_text.map((txt: RichTextItemResponse) => txt.plain_text);
  return <h3 id={getHeadingId(block.heading_2.rich_text)}>{TITLE}</h3>;
}

export function Heading_3({ block }: NotionComponentProps<"heading_3">) {
  const TITLE = block.heading_3.rich_text.map((txt: RichTextItemResponse) => txt.plain_text);
  return <h4 id={getHeadingId(block.heading_3.rich_text)}>{TITLE}</h4>;
}
