import { css } from "@pigment-css/react";
import type { ComponentPropsWithoutRef } from "react";

const textLink = css`
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
`;

export function TextLink({ className, ...rest }: ComponentPropsWithoutRef<"a">) {
  return <a {...rest} className={className ? `${textLink} ${className}` : textLink} />;
}
