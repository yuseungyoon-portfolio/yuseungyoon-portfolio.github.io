import type { Route } from "./+types/page";
import { RichText } from "features/notion/ui/richText/RichText";
import { Link, useRouteLoaderData } from "react-router";
import type { loader } from "./root";
import { getProperties } from "features/notion/lib/getProperties";
import { getPostSlug } from "features/notion/lib/slugify";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "유승윤 - 포트폴리오" },
    { name: "description", content: "유승윤 포트폴리오" },
  ];
}

export default function Home() {
  const pList = useRouteLoaderData<typeof loader>("root");
  const lastUpdated = pList?.sort((a, b) => {
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
    </div>
  );
}
