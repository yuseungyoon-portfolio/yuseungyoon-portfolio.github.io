// 빌드 전에 Notion 데이터를 한 번만 가져와 .notion-cache/snapshot.json으로 저장한다.
// 이미지 블록은 이 단계에서 public/notion-img로 다운로드되고, vite 빌드 시 build/client로 복사된다.
// `--if-missing`: 스냅샷이 이미 있으면 건너뛴다 (dev 서버 시작용).
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getRequestCount } from "../features/notion/api/client.server";
import { SNAPSHOT_PATH, fetchSnapshot } from "../features/notion/api/index.server";

if (process.argv.includes("--if-missing") && existsSync(SNAPSHOT_PATH)) {
  console.log(`Notion 스냅샷 재사용: ${SNAPSHOT_PATH}`);
  process.exit(0);
}

const key = process.env.NOTION_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;
if (!key || !databaseId) throw new Error("NOTION_KEY / NOTION_DATABASE_ID 환경변수가 필요합니다.");

const startedAt = Date.now();
const snapshot = await fetchSnapshot(key, databaseId);

await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
await writeFile(SNAPSHOT_PATH, JSON.stringify(snapshot));

console.log(
  `Notion 스냅샷 저장 완료: 포스트 ${Object.keys(snapshot.posts).length}개, ` +
    `API 요청 ${getRequestCount()}회, ${((Date.now() - startedAt) / 1000).toFixed(1)}s`,
);
