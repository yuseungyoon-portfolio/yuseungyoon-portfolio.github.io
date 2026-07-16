import type { TransformedNotionBlocks, WithChildren } from "./unions";

export function hasChildren<T extends TransformedNotionBlocks>(
  block: T,
): block is WithChildren<T> & { has_children: true } {
  return block.has_children;
}
