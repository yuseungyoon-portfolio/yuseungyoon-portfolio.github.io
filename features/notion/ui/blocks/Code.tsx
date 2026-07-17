import { css } from "@pigment-css/react";
import { useEffect, useState } from "react";
import { getCodeLang } from "../../lib";
import type { NotionComponentProps } from "../../model";

export function Code({ block }: NotionComponentProps<"code">) {
  const codeLang = getCodeLang(block.code.language);
  const codeText = block.code.rich_text
    .map((txt) => txt.plain_text)
    .join("")
    .replaceAll("\t", "  ");
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("shiki")
      .then(({ codeToHtml }) =>
        codeToHtml(codeText, {
          lang: block.code.language === "plain text" ? "text" : block.code.language,
          theme: "github-light",
        }),
      )
      .then((highlighted) => {
        if (!cancelled) setHtml(highlighted);
      })
      .catch(() => {
        // 지원하지 않는 언어는 하이라이트 없이 그대로 둔다
      });
    return () => {
      cancelled = true;
    };
  }, [codeText, block.code.language]);

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

        & pre {
          margin: 0;
          padding: 0.75rem 1rem 0.875rem;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          line-height: 1.65;
          background: transparent !important;
        }

        & code {
          font-family: var(--font-mono);
        }
      `}
    >
      <figcaption>{codeLang}</figcaption>
      {html ? (
        // oxlint-disable-next-line no-danger -- shiki가 생성한 신뢰 가능한 HTML
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre>
          <code>{codeText}</code>
        </pre>
      )}
    </figure>
  );
}
