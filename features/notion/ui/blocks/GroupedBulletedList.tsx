import type { NotionComponentProps } from "../../model";
import { BulletedListItem } from "./BulletedListItem";

export function BulletedListWrapper({ block }: NotionComponentProps<"grouped_bulleted_list_item">) {
  return (
    <ul>
      {block.grouped_bulleted_list_item.children.map((item) => (
        <BulletedListItem key={item.id} block={item} />
      ))}
    </ul>
  );
}
