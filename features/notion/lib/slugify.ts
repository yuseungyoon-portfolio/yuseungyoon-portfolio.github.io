import type { NotionPageMeta } from "../model";
import { getProperties } from "./getProperties";

/**
 * e.g. 포스트 제목 -> 포스트-제목
 */
export const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const getPostSlug = (post: NotionPageMeta) =>
  slugify(getProperties(post)["제목"]);
