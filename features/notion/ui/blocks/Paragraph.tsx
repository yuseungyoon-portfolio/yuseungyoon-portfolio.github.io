import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { getPlainText } from "../../lib";
import { hasChildren, type NotionComponentProps } from "../../model";
import { ChildrenBlocks } from "../ChildrenBlocks";
import { RichText } from "../richText/RichText";
import { Youtube } from "./Youtube";

const YOUTUBE_REGEX =
  /<<(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:[^\s>]*)?>>/;

export function Paragraph({ block }: NotionComponentProps<"paragraph">) {
  const flattenTxt: string = getPlainText(block.paragraph.rich_text);
  const [_, captured] = flattenTxt.match(YOUTUBE_REGEX) ?? ["", ""];
  if (captured.length) return <Youtube videoId={captured} />;

  return (
    <div>
      <p>
        {block.paragraph.rich_text.map((txt: RichTextItemResponse, idx: number) => (
          <RichText key={`${txt.type}${idx}`} richText={txt} />
        ))}
      </p>
      {hasChildren(block) && <ChildrenBlocks childrenBlocks={block.paragraph.children} />}
    </div>
  );
}
