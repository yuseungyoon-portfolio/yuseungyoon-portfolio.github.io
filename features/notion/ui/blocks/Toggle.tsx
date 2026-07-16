import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { hasChildren, type NotionComponentProps } from "../../model";
import { ChildrenBlocks } from "../ChildrenBlocks";
import { RichText } from "../richText/RichText";

export function Toggle({ block }: NotionComponentProps<"toggle">) {
  return (
    <details>
      <summary>
        {block.toggle.rich_text.map((txt: RichTextItemResponse, idx: number) => (
          <RichText key={`${txt.type}${idx}`} richText={txt} />
        ))}
      </summary>
      <div>{hasChildren(block) && <ChildrenBlocks childrenBlocks={block.toggle.children} />}</div>
    </details>
  );
}
