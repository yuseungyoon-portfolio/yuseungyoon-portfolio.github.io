import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { css } from "@pigment-css/react";
import { hasChildren, type NotionComponentProps } from "../../model";
import { RichText } from "../richText/RichText";

export function Table({ block }: NotionComponentProps<"table">) {
  if (!hasChildren(block)) return null;

  const rows = block.table.children;
  const hasColumnHeader = block.table.has_column_header;
  const hasRowHeader = block.table.has_row_header;

  return (
    <div
      className={css`
        margin: 1.25rem 0;
        overflow-x: auto;
      `}
    >
      <table>
        {hasColumnHeader && rows.length > 0 && (
          <thead>
            <tr>
              {(rows[0] as any).table_row.cells.map(
                (cell: RichTextItemResponse[], cellIdx: number) => (
                  <th key={cellIdx}>
                    {cell.map((txt: RichTextItemResponse, txtIdx: number) => (
                      <RichText key={`${txt.type}${txtIdx}`} richText={txt} />
                    ))}
                  </th>
                ),
              )}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.slice(hasColumnHeader ? 1 : 0).map((row: any) => (
            <tr key={row.id}>
              {row.table_row.cells.map((cell: RichTextItemResponse[], cellIdx: number) => {
                const isRowHeader = hasRowHeader && cellIdx === 0;
                const Tag = isRowHeader ? "th" : "td";
                return (
                  <Tag key={cellIdx}>
                    {cell.map((txt: RichTextItemResponse, txtIdx: number) => (
                      <RichText key={`${txt.type}${txtIdx}`} richText={txt} />
                    ))}
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
