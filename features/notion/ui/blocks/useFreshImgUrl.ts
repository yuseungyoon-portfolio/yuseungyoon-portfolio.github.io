import { useCallback, useEffect, useRef, useState } from "react";
import { getImgUrl } from "../../lib";
import type { ExtendedImageBlockObjectResponse } from "../../model";

export function useFreshImgUrl(block: ExtendedImageBlockObjectResponse) {
  const [imgUrl, setImgUrl] = useState(() => getImgUrl(block));
  const refreshed = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshed.current) return;
    refreshed.current = true;
    const res = await fetch(`/api/image/${block.id}`);
    if (!res.ok) return;
    const { url } = (await res.json()) as { url: string };
    setImgUrl(url);
  }, [block.id]);

  useEffect(() => {
    const { image } = block;
    if (image.type !== "file") return;
    if (new Date(image.file.expiry_time).getTime() <= Date.now()) refresh();
  }, [block, refresh]);

  return { imgUrl, refresh };
}
