import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ExtendedImageBlockObjectResponse } from "../../../model";
import { registerProcessor } from "../registry";

const IMG_DIR = "notion-img";

const extFromUrl = (url: string) => {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return ext || ".png";
};

registerProcessor(
  "image",
  async (block: ImageBlockObjectResponse): Promise<ExtendedImageBlockObjectResponse> => {
    const url = block.image.type === "file" ? block.image.file.url : block.image.external.url;
    if (!url) return block;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const filename = `${block.id}${extFromUrl(url)}`;

      // dev에서는 public/, 빌드 시에는 이미 복사가 끝난 build/client/에도 기록
      const targets = ["public", path.join("build", "client")]
        .map((dir) => path.join(process.cwd(), dir))
        .filter((dir) => existsSync(dir));

      for (const dir of targets) {
        const outDir = path.join(dir, IMG_DIR);
        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, filename), buf);
      }

      return {
        ...block,
        image: { ...block.image, cached_url: `/${IMG_DIR}/${filename}` },
      };
    } catch (err) {
      console.error("IMAGE CACHE ERROR", block.id, err);
      return block;
    }
  },
);
