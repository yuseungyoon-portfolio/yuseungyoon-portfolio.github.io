# features/notion

Notion 데이터베이스를 가져와 React 컴포넌트로 재귀 렌더링하는 feature.

## 세그먼트

- `api/` — Notion SDK fetch + 블록 후처리(processBlock). **서버 전용** (`node:https` 사용). 반드시 loader/prerender에서 `features/notion/api/index.server`로만 import할 것.
- `model/` — 블록/페이지 타입, 타입 가드
- `lib/` — 순수 유틸 (getPlainText, slugify, getNotionPageMeta 등)
- `ui/` — 재귀 렌더 컴포넌트 (RenderNotion → Block → componentMap)

## 사용 예

```tsx
// routes/routes/post.tsx
import { getFullNotionData } from "features/notion/api/index.server";
import { RenderNotion } from "features/notion/ui";

export async function loader() {
  const pages = await getFullNotionData(process.env.NOTION_KEY!, process.env.NOTION_DATABASE_ID!);
  return { pages };
}

export default function Post({ loaderData }: Route.ComponentProps) {
  return <RenderNotion blocks={loaderData.pages[0].content} />;
}
```
