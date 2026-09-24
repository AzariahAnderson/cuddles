import {
  Command as CommandIcon,
  FileCode,
  Files,
  Keyboard,
  KeyRound,
  Monitor,
  Moon,
  Palette,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Search,
  Settings,
  Sparkles,
  SquarePen,
  SquareTerminal,
  Sun,
} from "@cuddles/design-system";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { AppPath } from "../paths";
import { useChatStore } from "../state/chat";
import { useUiStore } from "../state/ui";
import { type Command, commandRegistry } from "./registry";
import { eventToCombo } from "./shortcuts";

/** Registers the built-in commands. Later features register their own the same way. */
export function useCoreCommands(): void {
  const navigate = useNavigate();

  useEffect(() => {
    const ui = () => useUiStore.getState();
    const go = (to: AppPath) => () => {
      void navigate({ to });
    };

    const commands: readonly Command[] = [
      {
        id: "palette.toggle",
        title: "Open command palette",
        group: "General",
        shortcut: "Mod+K",
        icon: CommandIcon,
        keywords: ["run", "search"],
        execute: () => ui().setPaletteOpen(!ui().paletteOpen),
      },
      {
        id: "view.sidebar",
        title: "Toggle sidebar",
        group: "View",
        shortcut: "Mod+B",
        icon: PanelLeft,
        execute: () => ui().toggleSidebar(),
      },
      {
        id: "view.utility",
        title: "Toggle utility panel",
        group: "View",
        shortcut: "Mod+Alt+B",
        icon: PanelRight,
        keywords: ["inspector", "activity", "right"],
        execute: () => ui().toggleUtility(),
      },
      {
        id: "view.terminal",
        title: "Toggle terminal drawer",
        group: "View",
        shortcut: "Mod+J",
        icon: PanelBottom,
        keywords: ["console", "shell"],
        execute: () => ui().toggleTerminal(),
      },
      {
        id: "nav.workspace",
        title: "Go to Workspace",
        group: "Navigate",
        icon: Files,
        keywords: ["home", "project"],
        execute: go("/workspace"),
      },
      {
        id: "nav.chat",
        title: "Go to AI assistant",
        group: "Navigate",
        shortcut: "Mod+Shift+A",
        icon: Sparkles,
        keywords: ["chat", "conversation", "ai"],
        execute: go("/chat"),
      },
      {
        id: "nav.editor",
        title: "Go to Editor",
        group: "Navigate",
        icon: FileCode,
        execute: go("/editor"),
      },
      {
        id: "nav.terminal",
        title: "Open terminal (full view)",
        group: "Navigate",
        icon: SquareTerminal,
        execute: go("/terminal"),
      },
      {
        id: "nav.search",
        title: "Search in workspace",
        group: "Navigate",
        shortcut: "Mod+Shift+F",
        icon: Search,
        execute: go("/search"),
      },
      {
        id: "nav.settings",
        title: "Open settings",
        group: "Navigate",
        shortcut: "Mod+,",
        icon: Settings,
        execute: go("/settings/providers"),
      },
      {
        id: "nav.providers",
        title: "Configure AI providers",
        group: "Settings",
        icon: KeyRound,
        keywords: ["api", "key", "model", "openai", "anthropic", "ollama"],
        execute: go("/settings/providers"),
      },
      {
        id: "nav.appearance",
        title: "Appearance settings",
        group: "Settings",
        icon: Palette,
        keywords: ["theme"],
        execute: go("/settings/appearance"),
      },
      {
        id: "nav.keybindings",
        title: "Keyboard shortcuts",
        group: "Settings",
        icon: Keyboard,
        execute: go("/settings/keybindings"),
      },
      {
        id: "chat.new",
        title: "New conversation",
        group: "AI",
        shortcut: "Mod+Shift+N",
        icon: SquarePen,
        execute: () => {
          useChatStore.getState().resetConversation();
          void navigate({ to: "/chat" });
        },
      },
      {
        id: "theme.dark",
        title: "Theme: Dark",
        group: "Appearance",
        icon: Moon,
        execute: () => ui().setTheme("dark"),
      },
      {
        id: "theme.light",
        title: "Theme: Light",
        group: "Appearance",
        icon: Sun,
        execute: () => ui().setTheme("light"),
      },
      {
        id: "theme.system",
        title: "Theme: Match system",
        group: "Appearance",
        icon: Monitor,
        execute: () => ui().setTheme("system"),
      },
    ];

    const disposers = commands.map((command) => commandRegistry.register(command));
    return () => {
      for (const dispose of disposers) {
        dispose();
      }
    };
  }, [navigate]);
}

/** One window-level listener; every shortcut is looked up in the command registry. */
export function useGlobalShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) {
        return;
      }
      const combo = eventToCombo(event);
      if (!combo) {
        return;
      }
      const command = commandRegistry.byShortcut(combo);
      if (!command) {
        return;
      }
      event.preventDefault();
      void commandRegistry.execute(command.id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}