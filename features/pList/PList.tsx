import { css } from "@pigment-css/react";
import { Heading, Text } from "features/common";
import { getPostSlug } from "features/notion/lib";
import { getProperties } from "features/notion/lib/getProperties";
import type { NotionPageMeta } from "features/notion/model";
import { NavLink } from "react-router";

function PListGroup({ label, posts }: { label: string; posts: NotionPageMeta[] }) {
  return (
    <>
      <Heading
        as="div"
        className={css`
          margin-top: 1.25rem;
        `}
      >
        {label}
      </Heading>
      {posts.map((p) => (
        <li key={p.id}>
          <Text as={NavLink} to={`/p/${getPostSlug(p)}`}>
            {getProperties(p)["제목"]}
          </Text>
        </li>
      ))}
    </>
  );
}

export function PList({
  pList,
  open,
  onNavigate,
}: {
  pList: [NotionPageMeta[], NotionPageMeta[]];
  open: boolean;
  onNavigate: () => void;
}) {
  const [freelance, side] = pList;
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
            inset: 0 0 auto 0;
            width: 100%;
            max-height: 100dvh;
            z-index: 10;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--color-border);
            padding: 3.25rem 1.25rem 1rem;
            overflow-y: auto;
          }
        }
      `}
    >
      <h1>
        <Heading as={NavLink} to="/">
          유승윤 포트폴리오
        </Heading>
      </h1>
      <ul
        className={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <PListGroup label="경력 프로젝트" posts={freelance} />
        <PListGroup label="개인/팀 프로젝트" posts={side} />
      </ul>
    </nav>
  );
}
