// 프리렌더 결과물의 percent-encoding된 파일명을 디코드된 이름으로 변경한다.
// GitHub Pages 등 정적 호스팅은 요청 URL을 디코드해서 파일을 찾으므로
// 디스크의 파일명도 디코드된 상태여야 한글 슬러그 경로가 매칭된다.
import { readdirSync, renameSync } from "node:fs";
import path from "node:path";

const decodeDir = (dir: string) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const current = path.join(dir, entry.name);
    let target = current;

    const decoded = decodeURIComponent(entry.name);
    if (decoded !== entry.name) {
      target = path.join(dir, decoded);
      renameSync(current, target);
    }

    if (entry.isDirectory()) decodeDir(target);
  }
};

decodeDir(path.join(process.cwd(), "build", "client"));
