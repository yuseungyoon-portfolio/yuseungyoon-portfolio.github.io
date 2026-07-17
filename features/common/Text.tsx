import { css } from "@pigment-css/react";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const text = css`
  display: block;
  font-size: 0.9rem;
  line-height: 1.65;
  word-break: keep-all;
`;

type TextProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Text<T extends ElementType = "div">({ as, className, ...rest }: TextProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag {...rest} className={className ? `${text} ${className}` : text} />;
}
