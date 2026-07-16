import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { css } from "@pigment-css/react";
import type { NotionComponentProps } from "../../model";
import { RichText } from "../richText/RichText";

export function Callout({ block }: NotionComponentProps<"callout">) {
  const icon = block.callout.icon;
  return (
    <aside
      className={css`
        display: flex;
        gap: 0.625rem;
        margin: 1.25rem 0;
        padding: 1rem 1.125rem;
        background: var(--color-surface);
      `}
    >
      <span>{icon && "emoji" in icon && icon.emoji}</span>
      <div>
        {block.callout.rich_text.map((txt: RichTextItemResponse, idx) => (
          <RichText key={`${txt.type}${idx}`} richText={txt} />
        ))}
      </div>
    </aside>
  );
}
