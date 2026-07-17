import { css } from "@pigment-css/react";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const heading = css`
  display: block;
  font-size: 0.9rem;
  line-height: 1.65;
  font-weight: 600;
  word-break: keep-all;
`;

const underlined = css`
  border-bottom: 1px solid var(--color-text);
`;

type HeadingProps<T extends ElementType> = {
  as?: T;
  underline?: boolean;
} & ComponentPropsWithoutRef<T>;

export function Heading<T extends ElementType = "h1">({
  as,
  underline,
  className,
  ...rest
}: HeadingProps<T>) {
  const Tag = (as ?? "h1") as ElementType;
  return (
    <Tag
      {...rest}
      className={[heading, underline && underlined, className].filter(Boolean).join(" ")}
    />
  );
}
