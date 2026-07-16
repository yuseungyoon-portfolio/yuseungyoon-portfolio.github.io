import type {
  ExtendedBlockObjectResponse,
  ExtendedBlockTypes,
  GroupedBulletedListItemResponse,
  GroupedNumberedListItemResponse,
  TraversableBlock,
} from "../../model";

const isTargetBlocks = (
  type: ExtendedBlockTypes,
): type is "bulleted_list_item" | "numbered_list_item" => {
  return type === "bulleted_list_item" || type === "numbered_list_item";
};

const createGroupedBlock = (
  type: "bulleted_list_item" | "numbered_list_item",
  children: ExtendedBlockObjectResponse[],
): GroupedBulletedListItemResponse | GroupedNumberedListItemResponse => {
  const firstChild = children[0];
  if (!firstChild) throw new Error("Cannot create grouped block from empty children");
  const id = `grouped_${type}_${firstChild.id}`;

  const baseData = {
    object: "block" as const,
    created_time: firstChild.created_time,
    last_edited_time: firstChild.last_edited_time,
    created_by: firstChild.created_by,
    last_edited_by: firstChild.last_edited_by,
    archived: firstChild.archived,
    parent: firstChild.parent,
    id,
    has_children: false,
  };

  if (type === "bulleted_list_item") {
    return {
      ...baseData,
      type: "grouped_bulleted_list_item",
      grouped_bulleted_list_item: { children: children as any },
    } as GroupedBulletedListItemResponse;
  } else {
    return {
      ...baseData,
      type: "grouped_numbered_list_item",
      grouped_numbered_list_item: { children: children as any },
    } as GroupedNumberedListItemResponse;
  }
};

export const group = (blocks: ExtendedBlockObjectResponse[]): TraversableBlock[] => {
  if (!blocks.length) return [];

  const result: ExtendedBlockObjectResponse[] = [];
  let group: ExtendedBlockObjectResponse[] = [];
  let prevType: ExtendedBlockTypes | null = null;

  blocks.forEach((block, idx) => {
    const currType = block.type;

    if (isTargetBlocks(currType)) {
      if (prevType === currType) {
        group.push(block);
      } else {
        if (group.length > 0 && prevType && isTargetBlocks(prevType)) {
          result.push(createGroupedBlock(prevType, group));
          group = [];
        }
        group.push(block);
        prevType = currType;
      }
    } else {
      if (group.length > 0 && prevType && isTargetBlocks(prevType)) {
        result.push(createGroupedBlock(prevType, group));
        group = [];
      }
      result.push(block);
      prevType = currType;
    }

    if (idx === blocks.length - 1 && group.length > 0 && prevType && isTargetBlocks(prevType)) {
      result.push(createGroupedBlock(prevType, group));
    }
  });

  return result as TraversableBlock[];
};
