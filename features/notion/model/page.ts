import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type PropertyTypes = PageObjectResponse["properties"][string]["type"];
type Property<T extends PropertyTypes> = Extract<
  PageObjectResponse["properties"][string],
  { type: T }
>;

type PageProperties = {
  제목: Property<"title">;
  요약: Property<"rich_text">;
  역할: Property<"rich_text">;
  기간: Property<"date">;
  "배포 링크": Property<"url">;
  Github: Property<"url">;
  "러닝 포인트": Property<"multi_select">;
  구분: Property<"multi_select">;
};

export type NotionPageMeta = Omit<PageObjectResponse, "properties"> & {
  properties: PageProperties;
};
