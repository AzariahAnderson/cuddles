import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";
import { Icon } from "./Icon";

export type ControlSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "ghost";

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export interface ButtonProps extends NativeButtonProps {
  readonly variant?: ButtonVariant;
  readonly size?: ControlSize;
  readonly icon?: LucideIcon;
  readonly className?: string;
  readonly children: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cx("cd-btn", `cd-btn-${variant}`, `cd-btn-${size}`, className)}
      {...rest}
    >
      {icon ? <Icon icon={icon} size={size === "lg" ? 18 : 16} /> : null}
      {children}
    </button>
  );
}

export interface IconButtonProps extends NativeButtonProps {
  readonly icon: LucideIcon;
  /** Required: icon-only controls must have an accessible name. */
  readonly label: string;
  readonly size?: ControlSize;
  readonly pressed?: boolean;
  readonly className?: string;
}

export function IconButton({
  icon,
  label,
  size = "md",
  pressed,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      className={cx("cd-iconbtn", `cd-iconbtn-${size}`, className)}
      {...rest}
    >
      <Icon icon={icon} size={size === "lg" ? 18 : 16} />
    </button>
  );
}

export function Kbd({ children }: { readonly children: ReactNode }) {
  return <kbd className="cd-kbd">{children}</kbd>;
}

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "error" | "info";

export interface BadgeProps {
  readonly tone?: BadgeTone;
  readonly children: ReactNode;
}

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span className={cx("cd-badge", tone !== "neutral" && `cd-badge-${tone}`)}>{children}</span>
  );
}
