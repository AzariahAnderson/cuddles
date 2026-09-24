import type { CSSProperties, ReactNode } from "react";
import { cx } from "../cx";

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export interface StackProps {
  readonly direction?: "row" | "column";
  readonly gap?: Space;
  readonly align?: CSSProperties["alignItems"];
  readonly justify?: CSSProperties["justifyContent"];
  readonly wrap?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Stack({
  direction = "column",
  gap = 3,
  align,
  justify,
  wrap = false,
  className,
  children,
}: StackProps) {
  const style: CSSProperties = {
    display: "flex",
    flexDirection: direction,
    flexWrap: wrap ? "wrap" : "nowrap",
    gap: `var(--space-${gap})`,
    ...(align ? { alignItems: align } : {}),
    ...(justify ? { justifyContent: justify } : {}),
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export interface DividerProps {
  readonly orientation?: "horizontal" | "vertical";
}

export function Divider({ orientation = "horizontal" }: DividerProps) {
  if (orientation === "vertical") {
    return <div aria-hidden="true" className="cd-divider cd-divider-v" />;
  }
  return <hr className="cd-divider" />;
}

export interface SurfaceProps {
  readonly tone?: "base" | "raised";
  readonly bordered?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Surface({ tone = "base", bordered = true, className, children }: SurfaceProps) {
  return (
    <div
      className={cx(
        "cd-surface",
        tone === "raised" && "cd-surface-raised",
        bordered && "cd-surface-bordered",
        className,
      )}
    >
      {children}
    </div>
  );
}
