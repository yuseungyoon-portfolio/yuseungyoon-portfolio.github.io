import { css } from "@pigment-css/react";
import { getPlainText } from "../../lib";
import type { NotionComponentProps } from "../../model";

const editedUrl = (url: string) => {
  const edited = url.replace(/^(http?:\/\/)?(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");
  const idx = edited.indexOf("/");
  return idx === -1 ? edited : edited.slice(0, idx);
};

export function Bookmark({ block }: NotionComponentProps<"bookmark">) {
  const fallbackTitle = getPlainText(block.bookmark.caption);
  const title = block.bookmarkInfo.title ?? fallbackTitle;

  return (
    <a
      className={css`
        && {
          display: block;
          margin: 1.25rem 0;
          padding: 0.875rem 1.125rem;
          border: 1px solid var(--color-border);
          color: inherit;
          text-decoration: none;
        }

        &&:hover {
          background: var(--color-surface);
        }
      `}
      href={block.bookmark.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Bookmark: ${title || "No Title Available"}`}
    >
      <span
        className={css`
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
        `}
      >
        {title}
      </span>
      <span
        className={css`
          display: block;
          margin-top: 0.125rem;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        `}
      >
        {editedUrl(block.bookmark.url)}
      </span>
      {block.bookmarkInfo.description && (
        <span
          className={css`
            display: block;
            margin-top: 0.375rem;
            font-size: 0.85rem;
            color: var(--color-text-muted);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `}
        >
          {block.bookmarkInfo.description}
        </span>
      )}
    </a>
  );
}
