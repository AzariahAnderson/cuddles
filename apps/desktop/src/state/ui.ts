import type { ThemePreference } from "@cuddles/design-system";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const LAYOUT = {
  sidebar: { min: 200, max: 480, initial: 260 },
  utility: { min: 260, max: 560, initial: 340 },
  terminal: { min: 120, max: 640, initial: 260 },
} as const;

export interface UiState {
  readonly theme: ThemePreference;
  readonly sidebarOpen: boolean;
  readonly sidebarWidth: number;
  readonly utilityOpen: boolean;
  readonly utilityWidth: number;
  readonly terminalOpen: boolean;
  readonly terminalHeight: number;
  readonly paletteOpen: boolean;
  readonly setTheme: (theme: ThemePreference) => void;
  readonly setSidebarOpen: (open: boolean) => void;
  readonly toggleSidebar: () => void;
  readonly setSidebarWidth: (width: number) => void;
  readonly setUtilityOpen: (open: boolean) => void;
  readonly toggleUtility: () => void;
  readonly setUtilityWidth: (width: number) => void;
  readonly setTerminalOpen: (open: boolean) => void;
  readonly toggleTerminal: () => void;
  readonly setTerminalHeight: (height: number) => void;
  readonly setPaletteOpen: (open: boolean) => void;
}

/** Layout and theme are remembered locally (no secrets here). Moves to native settings later. */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "dark",
      sidebarOpen: true,
      sidebarWidth: LAYOUT.sidebar.initial,
      utilityOpen: false,
      utilityWidth: LAYOUT.utility.initial,
      terminalOpen: false,
      terminalHeight: LAYOUT.terminal.initial,
      paletteOpen: false,
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
      setUtilityOpen: (utilityOpen) => set({ utilityOpen }),
      toggleUtility: () => set((s) => ({ utilityOpen: !s.utilityOpen })),
      setUtilityWidth: (utilityWidth) => set({ utilityWidth }),
      setTerminalOpen: (terminalOpen) => set({ terminalOpen }),
      toggleTerminal: () => set((s) => ({ terminalOpen: !s.terminalOpen })),
      setTerminalHeight: (terminalHeight) => set({ terminalHeight }),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
    }),
    {
      name: "cuddles.ui.v1",
      partialize: (s) => ({
        theme: s.theme,
        sidebarOpen: s.sidebarOpen,
        sidebarWidth: s.sidebarWidth,
        utilityOpen: s.utilityOpen,
        utilityWidth: s.utilityWidth,
        terminalOpen: s.terminalOpen,
        terminalHeight: s.terminalHeight,
      }),
    },
  ),
);