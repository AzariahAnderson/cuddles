import type { ReactNode } from "react";
import { cx } from "../cx";

export type TextVariant =
  | "display"
  | "heading"
  | "title"
  | "body"
  | "secondary"
  | "label"
  | "caption"
  | "code";
export type TextTag = "span" | "p" | "h1" | "h2" | "h3" | "div" | "code";

export interface TextProps {
  readonly variant?: TextVariant;
  readonly as?: TextTag;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Text({ variant = "body", as = "span", className, children }: TextProps) {
  const Tag = as;
  return <Tag className={cx(`cd-text-${variant}`, className)}>{children}</Tag>;
}
