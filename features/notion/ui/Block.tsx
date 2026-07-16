import type { ExtendedBlockTypes, NotionBlockComponent, TransformedNotionBlock } from "../model";
import { blockComponentMap } from "./componentMap";

export function Block<T extends ExtendedBlockTypes>({
  block,
}: {
  block: TransformedNotionBlock<T>;
}) {
  const Component = blockComponentMap[block.type] as NotionBlockComponent<T> | undefined;
  if (!Component) return null;
  return <Component block={block} />;
}
