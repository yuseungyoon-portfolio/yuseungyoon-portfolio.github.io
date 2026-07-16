import { css } from "@pigment-css/react";
import { getPostSlug } from "features/notion/lib";
import { getProperties } from "features/notion/lib/getProperties";
import type { NotionPageMeta } from "features/notion/model";
import { NavLink } from "react-router";

export function PList({
  pList,
  open,
  onNavigate,
}: {
  pList: NotionPageMeta[];
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <nav
      data-open={open}
      onClick={onNavigate}
      className={css`
        flex: none;
        width: 20rem;
        position: sticky;
        top: 1rem;

        @media (width < 768px) {
          display: none;

          &[data-open="true"] {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 10;
            background: #fff;
            padding: 3.25rem 1.25rem 1rem;
            overflow-y: auto;
          }
        }
      `}
    >
      <h1>
        <NavLink
          to="/"
          className={css`
            display: block;
            font-size: 0.9rem;
            line-height: 1.4;
            font-weight: 600;
          `}
        >
          유승윤 포트폴리오
        </NavLink>
      </h1>
      <ul
        className={css`
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        `}
      >
        {pList?.map((p) => {
          const props = getProperties(p);
          return (
            <li key={p.id}>
              <NavLink
                to={`/p/${getPostSlug(p)}`}
                className={css`
                  display: block;
                  font-size: 0.9rem;
                  line-height: 1.4;
                `}
              >
                {props["제목"]}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
