import type { RichTextItemResponse } from "@notionhq/client";

export function getHeadingId(richText: RichTextItemResponse[]) {
  const text = richText.map((t) => t.plain_text).join(" ");
  //특수문자 제거
  let result = text;
  result = result.replace(/[^\w가-힣\s]/g, "");
  //공백 대체
  result = result.replace(/\s/g, "-");
  return result;
}
