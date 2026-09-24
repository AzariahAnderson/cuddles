import type { LucideIcon } from "lucide-react";

export interface IconProps {
  readonly icon: LucideIcon;
  readonly size?: 14 | 16 | 18 | 20;
  /** Provide only when the icon carries meaning by itself; otherwise it is decorative. */
  readonly label?: string;
}

export function Icon({ icon: Glyph, size = 16, label }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.75}
      absoluteStrokeWidth
      focusable={false}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
