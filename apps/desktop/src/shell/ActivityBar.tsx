import {
  Blocks,
  Files,
  FileCode,
  GitBranch,
  Icon,
  type LucideIcon,
  Play,
  Search,
  Settings,
  Sparkles,
  SquareTerminal,
  Tooltip,
  useSlideIndicator,
} from "@cuddles/design-system";
import { Link, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";
import { formatShortcut } from "../commands/shortcuts";
import type { AppPath } from "../paths";
import { useUiStore } from "../state/ui";

interface NavItem {
  readonly key: string;
  readonly to: AppPath;
  readonly label: string;
  readonly icon: LucideIcon;
}

const ITEMS: readonly NavItem[] = [
  { key: "workspace", to: "/workspace", label: "Workspace", icon: Files },
  { key: "chat", to: "/chat", label: "AI assistant", icon: Sparkles },
  { key: "editor", to: "/editor", label: "Editor", icon: FileCode },
  { key: "search", to: "/search", label: "Search", icon: Search },
  { key: "source-control", to: "/source-control", label: "Source control", icon: GitBranch },
  { key: "run", to: "/run", label: "Run", icon: Play },
  { key: "extensions", to: "/extensions", label: "Extensions", icon: Blocks },
];

export function ActivityBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const terminalOpen = useUiStore((s) => s.terminalOpen);
  const toggleTerminal = useUiStore((s) => s.toggleTerminal);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const area = pathname.split("/")[1] ?? "";
  const activeKey = ITEMS.find((item) => item.key === area)?.key ?? null;
  useSlideIndicator(listRef, indicatorRef, activeKey);

  return (
    <nav className="cd-activity" aria-label="Primary" data-startup>
      <div ref={listRef} className="cd-activity-list">
        <span ref={indicatorRef} className="cd-activity-indicator" aria-hidden="true" />
        {ITEMS.map((item) => (
          <Tooltip key={item.key} label={item.label} side="right">
            <Link
              to={item.to}
              className="cd-nav"
              data-nav-key={item.key}
              data-active={item.key === activeKey || undefined}
              aria-label={item.label}
            >
              <Icon icon={item.icon} size={18} />
            </Link>
          </Tooltip>
        ))}
      </div>
      <div className="cd-activity-list">
        <Tooltip label="Terminal" shortcut={formatShortcut("Mod+J")} side="right">
          <button
            type="button"
            className="cd-nav"
            aria-label="Toggle terminal drawer"
            aria-pressed={terminalOpen}
            onClick={toggleTerminal}
          >
            <Icon icon={SquareTerminal} size={18} />
          </button>
        </Tooltip>
        <Tooltip label="Settings" shortcut={formatShortcut("Mod+,")} side="right">
          <Link
            to="/settings/providers"
            className="cd-nav"
            data-active={area === "settings" || undefined}
            aria-label="Settings"
          >
            <Icon icon={Settings} size={18} />
          </Link>
        </Tooltip>
      </div>
    </nav>
  );
}