import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ReactNode } from "react";

export function Annotations({
  richText,
  children,
}: {
  richText: RichTextItemResponse;
  children: ReactNode;
}) {
  const { bold, code, italic, strikethrough, underline } = richText.annotations;

  let node = children;
  if (code) node = <code>{node}</code>;
  if (underline) node = <u>{node}</u>;
  if (italic) node = <em>{node}</em>;
  if (bold) node = <strong>{node}</strong>;
  if (strikethrough) node = <s>{node}</s>;
  return node;
}
