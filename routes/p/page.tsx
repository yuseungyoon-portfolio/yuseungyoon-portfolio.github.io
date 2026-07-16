import { getFullPost, getPList } from "features/notion/api/index.server";
import type { Route } from "./+types/page";
import { RenderNotion } from "features/notion/ui";
import {
  getProperties,
  type PlainProperties,
} from "features/notion/lib/getProperties";
import { getPostSlug } from "features/notion/lib/slugify";
import type { TransformedNotionBlocks } from "features/notion/model";
import { css } from "@pigment-css/react";

export async function loader({
  params,
}: Route.LoaderArgs): Promise<[PlainProperties, TransformedNotionBlocks[]]> {
  const pList = await getPList(
    process.env.NOTION_KEY!,
    process.env.NOTION_DATABASE_ID!,
  );
  const portfolio = pList.find((p) => getPostSlug(p) === params.slug);
  if (!portfolio) throw new Response("Not Found", { status: 404 });

  return [
    getProperties(portfolio),
    await getFullPost(process.env.NOTION_KEY!, portfolio.id),
  ];
}

export function meta({ params, matches }: Route.MetaArgs) {
  const pList = matches[0].loaderData;
  const portfolio = pList?.find((p) => getPostSlug(p) === params.slug);
  if (!portfolio) return [];

  const properties = getProperties(portfolio);
  return [
    { title: properties["제목"] },
    { name: "description", content: properties["요약"] },
  ];
}

export default function ProjectPage({ loaderData }: Route.ComponentProps) {
  const [meta, blocks] = loaderData;
  return (
    <article
      className={css`
        padding-bottom: 6rem;
        font-size: 0.9rem;
      `}
    >
      <section
        className={css`
          display: flex;
          align-items: center;
          justify-content: space-between;

          & h1 {
            font-size: 0.9rem;
            font-weight: 600;
            line-height: 1.4;
            word-break: keep-all;
          }

          @media (width < 768px) {
            padding-right: 2.5rem;
          }
        `}
      >
        <h1>{meta["제목"]}</h1>
      </section>
      <div
        className={css`
          margin: 1.25rem 0 0 25%;
          line-height: 1.65;
          color: var(--color-text-muted);

          & p {
            margin: 0 0 0.5rem;
            word-break: keep-all;
          }

          & > div {
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem 1.25rem;
          }

          & a {
            color: inherit;
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 0.2em;
          }

          @media (width < 1024px) {
            margin-left: 0;
          }
        `}
      >
        {meta["요약"] && <p>{meta["요약"]}</p>}
        <div>
          {meta["기간"] && <span>{meta["기간"]}</span>}
          {meta["배포 링크"] && (
            <a href={meta["배포 링크"]} target="_blank" rel="noreferrer">
              배포 링크
            </a>
          )}
          {meta["Github"] && (
            <a href={meta["Github"]} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
      <RenderNotion blocks={blocks} />
    </article>
  );
}
