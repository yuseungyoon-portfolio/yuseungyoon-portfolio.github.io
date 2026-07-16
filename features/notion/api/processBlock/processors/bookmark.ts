import https from "node:https";
import type { BookmarkBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { parseHTML } from "linkedom";
import type { BookmarkMeta, ExtendedBookmarkObjectResponse } from "../../../model";
import { registerProcessor } from "../registry";

const fetchMeta = async (url: string): Promise<BookmarkMeta> => {
  try {
    const html = await new Promise<string>((resolve, reject) => {
      const req = https.get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml",
          },
          rejectUnauthorized: false,
          timeout: 3_000,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data = data + chunk;
          });
          res.on("end", () => resolve(data));
        },
      );
      req.on("timeout", () => req.destroy(new Error(`timeout: ${url}`)));
      req.on("error", reject);
    });

    const { document } = parseHTML(html);
    const getMeta = (names: string[]) => {
      for (const name of names) {
        const el =
          document.querySelector(`meta[property="${name}"]`) ||
          document.querySelector(`meta[name="${name}"]`);

        if (el?.getAttribute("content")) {
          return el.getAttribute("content");
        }
      }
      return null;
    };

    return {
      url,
      title:
        getMeta(["og:title", "twitter:title"]) ||
        document.querySelector("title")?.textContent ||
        undefined,
      description: getMeta(["og:description", "twitter:description", "description"]) || undefined,
      image: getMeta(["og:image", "twitter:image"]) || undefined,
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error);
    return { url };
  }
};

registerProcessor(
  "bookmark",
  async (block: BookmarkBlockObjectResponse): Promise<ExtendedBookmarkObjectResponse> => {
    const bookmarkInfo = await fetchMeta(block.bookmark.url);
    return {
      ...block,
      bookmarkInfo,
    };
  },
);
