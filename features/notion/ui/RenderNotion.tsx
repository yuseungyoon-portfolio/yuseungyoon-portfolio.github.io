import { css } from "@pigment-css/react";
import type { TransformedNotionBlocks } from "../model";
import { Block } from "./Block";

export function RenderNotion({
  blocks,
}: {
  blocks: TransformedNotionBlocks[];
}) {
  return (
    <article
      className={css`
        font-size: 0.9rem;
        line-height: 1.65;
        word-break: keep-all;
        overflow-wrap: break-word;

        & p {
          margin-block: 0.75rem;
        }

        & h2,
        & h3,
        & h4 {
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.65;
        }

        & h2 {
          margin: 3.5rem 0 1.25rem;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid var(--color-text);
        }

        & h3 {
          margin: 1.75rem 0 0.5rem;
        }

        & h4 {
          margin: 1.5rem 0 0.5rem;
        }

        & strong {
          font-weight: 600;
        }

        & a {
          color: inherit;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 0.2em;
        }

        & ul,
        & ol {
          margin-block: 0.75rem;
          padding-left: 1.375rem;
        }

        & ul {
          list-style: square;
        }

        & ol {
          list-style: decimal;
        }

        & li {
          margin-block: 0.25rem;
        }

        & li > p {
          margin-block: 0;
        }

        & li ul,
        & li ol {
          margin-block: 0.25rem;
        }

        & blockquote {
          margin: 1.25rem 0;
          padding-left: 1.125rem;
          border-left: 3px solid var(--color-border);
          color: var(--color-text-muted);
        }

        & hr {
          border: 0;
          border-top: 1px solid var(--color-border);
          margin: 2rem 0;
        }

        & :not(pre) > code {
          font-family: var(--font-mono);
          font-size: 0.875em;
          background: var(--color-surface);
          padding: 0.125em 0.375em;
        }

        & table {
          border-collapse: collapse;
          line-height: 1.55;
        }

        & th,
        & td {
          border: 1px solid var(--color-border);
          padding: 0.4375rem 0.75rem;
          text-align: left;
          vertical-align: top;
        }

        & th {
          font-weight: 600;
          background: var(--color-surface);
        }

        & iframe {
          margin-block: 1.25rem;
        }

        & details {
          margin-block: 0.75rem;
        }

        & summary {
          cursor: pointer;
        }

        & details > div {
          padding-left: 1.25rem;
        }

        & > :not(h2) {
          margin-left: 25%;
        }

        @media (width < 1024px) {
          & > :not(h2) {
            margin-left: 0;
          }
        }
      `}
    >
      {blocks.map((b) => (
        <Block key={b.id} block={b} />
      ))}
    </article>
  );
}
