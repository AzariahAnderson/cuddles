import {
  ChevronDown,
  Command,
  DropdownMenu,
  FolderOpen,
  Icon,
  IconButton,
  type MenuEntry,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Search,
  Tooltip,
} from "@cuddles/design-system";
import { formatShortcut } from "../commands/shortcuts";
import { useUiStore } from "../state/ui";
import { useWorkspaceStore } from "../state/workspace";
import { Keys } from "./Shortcut";

const noop = (): void => undefined;

export function TitleBar() {
  const root = useWorkspaceStore((s) => s.root);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const utilityOpen = useUiStore((s) => s.utilityOpen);
  const terminalOpen = useUiStore((s) => s.terminalOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleUtility = useUiStore((s) => s.toggleUtility);
  const toggleTerminal = useUiStore((s) => s.toggleTerminal);
  const setPaletteOpen = useUiStore((s) => s.setPaletteOpen);

  const name = root ? (root.split(/[\\/]/).pop() ?? root) : "No workspace";

  const entries: readonly MenuEntry[] = [
    { kind: "label", id: "l-workspace", label: "Workspace" },
    {
      kind: "item",
      id: "open",
      label: "Open folder\u2026",
      icon: FolderOpen,
      disabled: true,
      onSelect: noop,
    },
    { kind: "separator", id: "s1" },
    { kind: "label", id: "l-recent", label: "No recent projects" },
  ];

  return (
    <header className="cd-titlebar" data-startup>
      <div className="cd-titlebar-left">
        <div className="cd-mark" aria-hidden="true">
          C
        </div>
        <DropdownMenu
          label="Workspace switcher"
          entries={entries}
          trigger={({ open, toggle }) => (
            <button
              type="button"
              className="cd-switcher"
              onClick={toggle}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <span className="cd-switcher-name">{name}</span>
              <Icon icon={ChevronDown} size={14} />
            </button>
          )}
        />
      </div>

      <button type="button" className="cd-cmdbar" onClick={() => setPaletteOpen(true)}>
        <Icon icon={Search} size={14} />
        <span className="cd-cmdbar-label">Search or run a command</span>
        <Keys combo="Mod+K" />
      </button>

      <div className="cd-titlebar-right" role="toolbar" aria-label="Layout">
        <Tooltip label="Command palette" shortcut={formatShortcut("Mod+K")}>
          <IconButton icon={Command} label="Command palette" onClick={() => setPaletteOpen(true)} />
        </Tooltip>
        <Tooltip label="Toggle sidebar" shortcut={formatShortcut("Mod+B")}>
          <IconButton
            icon={PanelLeft}
            label="Toggle sidebar"
            pressed={sidebarOpen}
            onClick={toggleSidebar}
          />
        </Tooltip>
        <Tooltip label="Toggle terminal drawer" shortcut={formatShortcut("Mod+J")}>
          <IconButton
            icon={PanelBottom}
            label="Toggle terminal drawer"
            pressed={terminalOpen}
            onClick={toggleTerminal}
          />
        </Tooltip>
        <Tooltip label="Toggle utility panel" shortcut={formatShortcut("Mod+Alt+B")}>
          <IconButton
            icon={PanelRight}
            label="Toggle utility panel"
            pressed={utilityOpen}
            onClick={toggleUtility}
          />
        </Tooltip>
      </div>
    </header>
  );
}