import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("page.tsx"),
  route("/p/:slug", "p/page.tsx"),
  route("/api/image/:blockId", "api/image.ts"),
] satisfies RouteConfig;
