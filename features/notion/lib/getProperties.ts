import type { NotionPageMeta } from "../model";

type Properties = NotionPageMeta["properties"];

export type PlainProperties = {
  [K in keyof Properties]: Properties[K] extends { type: "multi_select" }
    ? string[]
    : string;
};

function toPlainText(property: Properties[keyof Properties], fallback: string) {
  switch (property.type) {
    case "title":
      return property.title.map((t) => t.plain_text).join("") || fallback;
    case "rich_text":
      return property.rich_text.map((t) => t.plain_text).join("");
    case "url":
      return property.url ?? "";
    case "multi_select":
      return property.multi_select.map((option) => option.name);
  }
}

export function getProperties(post: NotionPageMeta): PlainProperties {
  return Object.fromEntries(
    Object.entries(post.properties).map(([key, property]) => [
      key,
      toPlainText(property, post.id),
    ]),
  ) as PlainProperties;
}
