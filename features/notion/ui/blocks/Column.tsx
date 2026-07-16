import { css } from "@pigment-css/react";
import { hasChildren, type NotionComponentProps } from "../../model";
import { ChildrenBlocks } from "../ChildrenBlocks";

export function Column({ block }: NotionComponentProps<"column">) {
  if (!hasChildren(block)) return null;

  return (
    <div
      className={css`
        flex: 1;
        min-width: 0;
      `}
    >
      <ChildrenBlocks childrenBlocks={block.column.children} />
    </div>
  );
}
