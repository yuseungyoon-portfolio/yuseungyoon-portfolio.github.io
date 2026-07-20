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
import { Heading, Text, TextLink } from "features/common";

export async function loader({
  params,
}: Route.LoaderArgs): Promise<[PlainProperties, TransformedNotionBlocks[]]> {
  const pList = await getPList(
    process.env.NOTION_KEY!,
    process.env.NOTION_DATABASE_ID!,
  );
  const flatten = pList.flat();
  const portfolio = flatten.find((p) => getPostSlug(p) === params.slug);
  if (!portfolio) throw new Response("Not Found", { status: 404 });

  return [
    getProperties(portfolio),
    await getFullPost(process.env.NOTION_KEY!, portfolio.id),
  ];
}

export function meta({ params, matches }: Route.MetaArgs) {
  const flatten = matches[0].loaderData.flat();
  const portfolio = flatten?.find((p) => getPostSlug(p) === params.slug);
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

          @media (width < 768px) {
            padding-right: 2.5rem;
          }
        `}
      >
        <Heading
          underline
          className={css`
            flex: 1;
          `}
        >
          {meta["제목"]}
        </Heading>
      </section>
      <Text
        className={css`
          margin: 1.25rem 0 0 25%;

          @media (width < 1024px) {
            margin-left: 0;
          }
        `}
      >
        <div
          className={css`
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem 1.25rem;
          `}
        >
          {meta["기간"] && <span>{meta["기간"]}</span>}
          {meta["배포 링크"] && (
            <TextLink href={meta["배포 링크"]} target="_blank" rel="noreferrer">
              배포 링크
            </TextLink>
          )}
          {meta["Github"] && (
            <TextLink href={meta["Github"]} target="_blank" rel="noreferrer">
              GitHub
            </TextLink>
          )}
        </div>
        {meta["역할"] && (
          <p>
            <strong>역할</strong> {meta["역할"]}
          </p>
        )}
        {meta["요약"] && (
          <p>
            <strong>요약</strong> {meta["요약"]}
          </p>
        )}
      </Text>
      <RenderNotion blocks={blocks} />
    </article>
  );
}
