import type { Config } from "@react-router/dev/config";
import { getPList } from "./features/notion/api/index.server";
import { getPostSlug } from "./features/notion/lib/slugify";

const pList = (
  await getPList(process.env.NOTION_KEY!, process.env.NOTION_DATABASE_ID!)
).flat();

export default {
  appDirectory: "app",
  ssr: false,
  async prerender() {
    return ["/", ...pList.map((p) => `/p/${getPostSlug(p)}`)];
  },
} satisfies Config;
