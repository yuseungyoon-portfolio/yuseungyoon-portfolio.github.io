import { Client } from "@notionhq/client";

// Notion API 제한: 통합당 평균 초당 3회. 여유를 두고 요청 시작 간격을 350ms로 맞춘다.
// 동시에 여러 요청이 떠 있을 수는 있지만 "시작"은 이 간격으로만 허용된다.
const MIN_INTERVAL_MS = 350;
const MAX_RETRIES = 6;

let nextSlot = 0;
const waitForSlot = async () => {
  const now = Date.now();
  const slot = Math.max(now, nextSlot);
  nextSlot = slot + MIN_INTERVAL_MS;
  if (slot > now) await new Promise((r) => setTimeout(r, slot - now));
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let requestCount = 0;
export const getRequestCount = () => requestCount;

const throttledFetch = async (
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> => {
  for (let attempt = 0; ; attempt++) {
    await waitForSlot();
    requestCount++;
    let res: Response;
    try {
      res = await fetch(input, init);
    } catch (err) {
      if (attempt >= MAX_RETRIES) throw err;
      console.warn(`NOTION NETWORK ERROR, retry ${attempt + 1}/${MAX_RETRIES}`, err);
      await sleep(1000 * 2 ** attempt);
      continue;
    }

    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= MAX_RETRIES) return res;

    const retryAfter = Number(res.headers.get("retry-after"));
    const delay =
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt;
    console.warn(`NOTION ${res.status}, retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms`);
    // 429면 다른 대기 요청들도 같이 밀어서 연쇄 429를 막는다.
    if (res.status === 429) nextSlot = Math.max(nextSlot, Date.now() + delay);
    await sleep(delay);
  }
};

let client: Client | undefined;
export const getNotionClient = (auth: string) =>
  (client ??= new Client({
    auth,
    fetch: throttledFetch as any,
    timeoutMs: 30_000,
    // 재시도는 throttledFetch가 담당한다.
    retry: false,
  } as ConstructorParameters<typeof Client>[0]));
