import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { Annotations } from "./Annotations";

export function RichText({ richText }: { richText: RichTextItemResponse }) {
  const href = richText.href;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        <Annotations richText={richText}>{richText.plain_text}</Annotations>
      </a>
    );
  }

  return <Annotations richText={richText}>{richText.plain_text}</Annotations>;
}
