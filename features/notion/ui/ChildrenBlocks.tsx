import type { TraversableBlock } from "../model";
import { Block } from "./Block";

export function ChildrenBlocks({ childrenBlocks }: { childrenBlocks: TraversableBlock[] }) {
  return childrenBlocks?.map((block) => <Block key={block.id} block={block} />);
}
