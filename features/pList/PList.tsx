import { css } from '@pigment-css/react'
import { Heading, Text } from 'features/common'
import { getPostSlug } from 'features/notion/lib'
import { getProperties } from 'features/notion/lib/getProperties'
import type { NotionPageMeta } from 'features/notion/model'
import { NavLink } from 'react-router'

function PListGroup({ label, posts }: { label: string; posts: NotionPageMeta[] }) {
  if (!posts || !posts.length) return
  return (
    <>
      <Heading
        as="h2"
        className={css`
          margin-top: 1.25rem;
        `}>
        {label}
      </Heading>
      <ul
        className={css`
          display: flex;
          flex-direction: column;
        `}>
        {posts.map(p => (
          <li key={p.id}>
            <Text as={NavLink} to={`/p/${getPostSlug(p)}`}>
              {getProperties(p)['제목']}
            </Text>
          </li>
        ))}
      </ul>
    </>
  )
}

export function PList({
  pList,
  open,
  onNavigate,
}: {
  pList: [NotionPageMeta[], NotionPageMeta[], NotionPageMeta[]]
  open: boolean
  onNavigate: () => void
}) {
  const [comp, freelance, side] = pList
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

          &[data-open='true'] {
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
      `}>
      <Heading as={NavLink} to="/">
        유승윤 포트폴리오
      </Heading>
      <PListGroup label="정규 경력" posts={comp} />
      <PListGroup label="외주/프리랜스" posts={freelance} />
      <PListGroup label="사이드" posts={side} />
    </nav>
  )
}
