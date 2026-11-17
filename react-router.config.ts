import type { Config } from "@react-router/dev/config";
import { getPList } from "./features/notion/api/index.server";
import { getPostSlug } from "./features/notion/lib/slugify";

export default {
  appDirectory: "app",
  ssr: false,
  async prerender() {
    const pList = (await getPList()).flat();
    return ["/", ...pList.map((p) => `/p/${getPostSlug(p)}`)];
  },
} satisfies Config;
