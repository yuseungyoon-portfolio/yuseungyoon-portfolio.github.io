import { css } from "@pigment-css/react";
import { hasChildren, type NotionComponentProps } from "../../model";
import { ChildrenBlocks } from "../ChildrenBlocks";

export function ColumnList({ block }: NotionComponentProps<"column_list">) {
  if (!hasChildren(block)) return null;

  return (
    <div
      className={css`
        display: flex;
        gap: 1.5rem;
        margin-block: 0.75rem;

        @media (max-width: 48rem) {
          flex-direction: column;
          gap: 0;
        }
      `}
    >
      <ChildrenBlocks childrenBlocks={block.column_list.children} />
    </div>
  );
}
