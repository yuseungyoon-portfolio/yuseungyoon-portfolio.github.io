import { css } from "@pigment-css/react";
import { useEffect, useRef, useState } from "react";
import { getPlainText } from "../../lib";
import type { NotionComponentProps } from "../../model";
import { useFreshImgUrl } from "./useFreshImgUrl";

export function NotionImg({ block }: NotionComponentProps<"image">) {
  const { imgUrl, refresh } = useFreshImgUrl(block);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  if (!imgUrl) return null;

  const caption = getPlainText(block.image.caption);

  return (
    <figure
      className={css`
        margin: 1.5rem 0;

        & img {
          width: 100%;
          height: auto;
        }

        & figcaption {
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          text-align: right;
        }
      `}
    >
      <div
        className={
          loaded
            ? undefined
            : css`
                position: relative;
                min-height: 300px;
                background: var(--color-surface);

                & > span {
                  position: absolute;
                  inset: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1.5rem;
                  letter-spacing: 0.1em;
                  color: var(--color-text-muted);
                }
              `
        }
      >
        <img
          ref={imgRef}
          src={imgUrl}
          alt={caption}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => refresh()}
        />
        {!loaded && <span aria-hidden>(...)</span>}
      </div>
      {block.image.caption.length > 0 && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
