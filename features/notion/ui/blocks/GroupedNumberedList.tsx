import type { NotionComponentProps } from "../../model";
import { NumberedListItem } from "./NumberedListItem";

export function NumberedListWrapper({ block }: NotionComponentProps<"grouped_numbered_list_item">) {
  return (
    <ol>
      {block.grouped_numbered_list_item.children.map((item) => (
        <NumberedListItem key={item.id} block={item} />
      ))}
    </ol>
  );
}
