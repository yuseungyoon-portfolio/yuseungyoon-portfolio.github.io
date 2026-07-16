import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { hasChildren, type NotionComponentProps } from "../../model";
import { ChildrenBlocks } from "../ChildrenBlocks";
import { RichText } from "../richText/RichText";

export function BulletedListItem({ block }: NotionComponentProps<"bulleted_list_item">) {
  return (
    <li>
      <p>
        {block.bulleted_list_item.rich_text.map((txt: RichTextItemResponse, idx: number) => (
          <RichText key={`${txt.type}${idx}`} richText={txt} />
        ))}
      </p>
      {hasChildren(block) && <ChildrenBlocks childrenBlocks={block.bulleted_list_item.children} />}
    </li>
  );
}
