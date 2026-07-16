import type { NotionPageMeta } from "../model";
import { getPlainText } from "./getPlainText";

export const getNotionPageMeta = (meta: NotionPageMeta) => ({
  title: getPlainText(meta.properties["제목"].title),
  summary: getPlainText(meta.properties["요약"].rich_text),
  period: meta.properties["기간"].date,
  deployUrl: meta.properties["배포 링크"].url,
  github: meta.properties["Github"].url,
  learningPoints: meta.properties["러닝 포인트"].multi_select,
  categories: meta.properties["구분"].multi_select,
});
