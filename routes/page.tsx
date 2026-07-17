import type { Route } from "./+types/page";
import { css } from "@pigment-css/react";
import { getDbDescription } from "features/notion/api/index.server";
import { RichText } from "features/notion/ui/richText/RichText";
import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "./root";

export async function loader(_: Route.LoaderArgs) {
  return await getDbDescription(
    process.env.NOTION_KEY!,
    process.env.NOTION_DATABASE_ID!,
  );
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: "유승윤 - 포트폴리오" },
    { name: "description", content: "유승윤 포트폴리오" },
  ];
}

export default function Home({
  loaderData: description,
}: Route.ComponentProps) {
  const pList = useRouteLoaderData<typeof rootLoader>("root");
  const flatten = pList?.flat();
  const lastUpdated =
    flatten &&
    flatten.sort((a, b) => {
      return (
        new Date(b.last_edited_time).getTime() -
        new Date(a.last_edited_time).getTime()
      );
    })[0]?.last_edited_time;
  const lastUpdatedDate = new Date(lastUpdated ?? 0);
  const lastUpdatedDateString = lastUpdatedDate
    .toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .slice(0, -1)
    .split(". ")
    .join("");

  return (
    <div>
      <h1
        className={css`
          display: block;
          font-size: 0.9rem;
          line-height: 1.65;
          font-weight: 600;
          border-bottom: 1px solid var(--color-text);
        `}
      >
        유승윤
      </h1>
      <div
        className={css`
          margin-top: 1.25rem;
          font-size: 0.9rem;
          line-height: 1.65;
          word-break: keep-all;
          white-space: pre-line;

          & a {
            color: inherit;
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 0.2em;
          }
        `}
      >
        {description.map((txt, idx) => (
          <RichText key={`${txt.type}${idx}`} richText={txt} />
        ))}
        <div
          className={css`
            margin-top: 1.25rem;
          `}
        >
          Last Updated at {lastUpdatedDateString}
        </div>
      </div>
    </div>
  );
}
