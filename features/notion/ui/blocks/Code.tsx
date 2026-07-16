import { css } from "@pigment-css/react";
import { getCodeLang } from "../../lib";
import type { NotionComponentProps } from "../../model";

export function Code({ block }: NotionComponentProps<"code">) {
  const codeLang = getCodeLang(block.code.language);
  const codeText = block.code.rich_text.map((txt) => txt.plain_text).join("");

  return (
    <figure
      className={css`
        margin: 1.25rem 0;
        border: 1px solid var(--color-border);
        background: var(--color-surface);

        & > figcaption {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-text-muted);
          padding: 0.625rem 1rem 0;
        }

        & > pre {
          margin: 0;
          padding: 0.75rem 1rem 0.875rem;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.65;
        }
      `}
    >
      <figcaption>{codeLang}</figcaption>
      <pre>
        <code>{codeText}</code>
      </pre>
    </figure>
  );
}
