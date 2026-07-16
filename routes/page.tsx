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

export default function Home({ loaderData: description }: Route.ComponentProps) {
  const pList = useRouteLoaderData<typeof rootLoader>("root");
  const lastUpdated = pList?.toSorted((a, b) => {
    return (
      new Date(b.last_edited_time).getTime() -
      new Date(a.last_edited_time).getTime()
    );
  })[0]?.last_edited_time;
  const lastUpdatedDate = new Date(lastUpdated ?? 0);
  const lastUpdatedDateString = lastUpdatedDate
    .toLocaleDateString()
    .replaceAll(/\. ?/g, "/");

  return (
    <div>
      <h1>About</h1>
      <p>유승윤 포트폴리오 {lastUpdatedDateString}</p>
      <div
        className={css`
          margin-top: 1.5rem;
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
      </div>
    </div>
  );
}
