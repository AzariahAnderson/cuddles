import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "../cx";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export interface EmptyStateProps {
  readonly icon?: LucideIcon;
  readonly title: string;
  readonly description?: string;
  readonly compact?: boolean;
  readonly children?: ReactNode;
}

export function EmptyState({ icon, title, description, compact = false, children }: EmptyStateProps) {
  return (
    <div className={cx("cd-empty", compact && "cd-empty-compact")}>
      {icon ? (
        <div className="cd-empty-icon">
          <Icon icon={icon} size={18} />
        </div>
      ) : null}
      <Text as="h3" variant="title">
        {title}
      </Text>
      {description ? (
        <Text as="p" variant="secondary" className="cd-empty-desc">
          {description}
        </Text>
      ) : null}
      {children ? <div className="cd-empty-actions">{children}</div> : null}
    </div>
  );
}

export interface PanelHeaderProps {
  readonly title: string;
  readonly actions?: ReactNode;
}

export function PanelHeader({ title, actions }: PanelHeaderProps) {
  return (
    <div className="cd-panelhead">
      <Text as="h2" variant="label">
        {title}
      </Text>
      {actions ? <div className="cd-panelhead-actions">{actions}</div> : null}
    </div>
  );
}