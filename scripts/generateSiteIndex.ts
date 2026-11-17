// 빌드 결과물에 llms.txt와 sitemap.xml을 생성한다.
// 내용이 Notion에서 오고 매일 재빌드되므로 public/에 정적 파일로 두지 않고
// 프리렌더와 동일한 소스(Notion 스냅샷)에서 매 빌드마다 새로 만든다.
import { getDbDescription, getPList } from "../features/notion/api/index.server";
import { getPlainText } from "../features/notion/lib/getPlainText";
import { getProperties } from "../features/notion/lib/getProperties";
import { getPostSlug } from "../features/notion/lib/slugify";
import type { NotionPageMeta } from "../features/notion/model";

const outDir = `${process.cwd()}/build/client`;
const domain = (await Bun.file(`${outDir}/CNAME`).text()).trim();
const origin = `https://${domain}`;

const [freelance, side] = await getPList();
const description = getPlainText(await getDbDescription());

const postUrl = (p: NotionPageMeta) => `${origin}/p/${encodeURIComponent(getPostSlug(p))}`;

// 목록 한 줄로 유지하기 위해 개행을 공백으로 접는다.
const inline = (s: string) => s.replaceAll(/\s*\n\s*/g, " ").trim();

const toLlmsEntry = (p: NotionPageMeta) => {
  const props = getProperties(p);
  // 제목에 포함된 [대괄호]가 마크다운 링크 문법을 깨뜨리지 않도록 이스케이프한다.
  const label = props["제목"].replaceAll(/[[\]]/g, (c) => `\\${c}`);
  const detail = [props["기간"], props["역할"], props["요약"]]
    .filter(Boolean)
    .map(inline)
    .join(" · ");
  return `- [${label}](${postUrl(p)})${detail ? `: ${detail}` : ""}`;
};

const llmsTxt = [
  "# 유승윤 포트폴리오",
  "",
  `> ${inline(description)}`,
  "",
  "## 경력 프로젝트",
  "",
  ...freelance.map(toLlmsEntry),
  "",
  "## 개인/팀 프로젝트",
  "",
  ...side.map(toLlmsEntry),
  "",
].join("\n");

const flatten = [...freelance, ...side];
const lastmod = flatten
  .map((p) => p.last_edited_time)
  .sort()
  .at(-1);

const urls = [
  { loc: `${origin}/`, lastmod },
  ...flatten.map((p) => ({ loc: postUrl(p), lastmod: p.last_edited_time })),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) =>
      `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;

await Bun.write(`${outDir}/llms.txt`, llmsTxt);
await Bun.write(`${outDir}/sitemap.xml`, sitemapXml);
