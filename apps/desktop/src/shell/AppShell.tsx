import {
  Splitter,
  useApplyTheme,
  useCollapseMotion,
  useEnterOnChange,
  useStartup,
} from "@cuddles/design-system";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useCoreCommands, useGlobalShortcuts } from "../commands/core";
import { LAYOUT, useUiStore } from "../state/ui";
import { ActivityBar } from "./ActivityBar";
import { CommandPalette } from "./CommandPalette";
import { SidebarContent } from "./SidebarContent";
import { StatusBar } from "./StatusBar";
import { TerminalDrawer } from "./TerminalDrawer";
import { TitleBar } from "./TitleBar";
import { UtilityPanel } from "./UtilityPanel";

/** Collapses panels automatically as the window gets narrow (only on threshold changes). */
function useResponsivePanels(): void {
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1000px)");
    const tiny = window.matchMedia("(max-width: 760px)");
    const apply = () => {
      const ui = useUiStore.getState();
      if (narrow.matches && ui.utilityOpen) ui.setUtilityOpen(false);
      if (tiny.matches && ui.sidebarOpen) ui.setSidebarOpen(false);
    };
    apply();
    narrow.addEventListener("change", apply);
    tiny.addEventListener("change", apply);
    return () => {
      narrow.removeEventListener("change", apply);
      tiny.removeEventListener("change", apply);
    };
  }, []);
}

export function AppShell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const utilityRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const theme = useUiStore((s) => s.theme);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const sidebarWidth = useUiStore((s) => s.sidebarWidth);
  const utilityOpen = useUiStore((s) => s.utilityOpen);
  const utilityWidth = useUiStore((s) => s.utilityWidth);
  const terminalOpen = useUiStore((s) => s.terminalOpen);
  const terminalHeight = useUiStore((s) => s.terminalHeight);
  const setSidebarWidth = useUiStore((s) => s.setSidebarWidth);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);
  const setUtilityWidth = useUiStore((s) => s.setUtilityWidth);
  const setUtilityOpen = useUiStore((s) => s.setUtilityOpen);
  const setTerminalHeight = useUiStore((s) => s.setTerminalHeight);
  const setTerminalOpen = useUiStore((s) => s.setTerminalOpen);

  // The full terminal page replaces the drawer.
  const drawerOpen = terminalOpen && !pathname.startsWith("/terminal");

  useApplyTheme(theme);
  useStartup(rootRef);
  useEnterOnChange(mainRef, pathname);
  useCollapseMotion(sidebarRef, sidebarOpen, "width", sidebarWidth);
  useCollapseMotion(utilityRef, utilityOpen, "width", utilityWidth);
  useCollapseMotion(drawerRef, drawerOpen, "height", terminalHeight);
  useCoreCommands();
  useGlobalShortcuts();
  useResponsivePanels();

  return (
    <div ref={rootRef} className="cd-app">
      <TitleBar />
      <div className="cd-body">
        <ActivityBar />

        <div
          ref={sidebarRef}
          className="cd-sidebar"
          style={{ width: sidebarOpen ? sidebarWidth : 0 }}
          inert={!sidebarOpen}
          data-startup
        >
          <div className="cd-sidebar-inner" style={{ width: sidebarWidth }}>
            <SidebarContent />
          </div>
        </div>
        {sidebarOpen ? (
          <Splitter
            orientation="vertical"
            label="Resize sidebar"
            value={sidebarWidth}
            min={LAYOUT.sidebar.min}
            max={LAYOUT.sidebar.max}
            defaultValue={LAYOUT.sidebar.initial}
            onChange={setSidebarWidth}
            onCollapse={() => setSidebarOpen(false)}
          />
        ) : null}

        <div className="cd-main" data-startup>
          <div ref={mainRef} className="cd-main-content">
            <Outlet />
          </div>
          {drawerOpen ? (
            <Splitter
              orientation="horizontal"
              reverse
              label="Resize terminal drawer"
              value={terminalHeight}
              min={LAYOUT.terminal.min}
              max={LAYOUT.terminal.max}
              defaultValue={LAYOUT.terminal.initial}
              onChange={setTerminalHeight}
              onCollapse={() => setTerminalOpen(false)}
            />
          ) : null}
          <div
            ref={drawerRef}
            className="cd-drawer"
            style={{ height: drawerOpen ? terminalHeight : 0 }}
            inert={!drawerOpen}
          >
            <div className="cd-drawer-inner" style={{ height: terminalHeight }}>
              <TerminalDrawer />
            </div>
          </div>
        </div>

        {utilityOpen ? (
          <Splitter
            orientation="vertical"
            reverse
            label="Resize utility panel"
            value={utilityWidth}
            min={LAYOUT.utility.min}
            max={LAYOUT.utility.max}
            defaultValue={LAYOUT.utility.initial}
            onChange={setUtilityWidth}
            onCollapse={() => setUtilityOpen(false)}
          />
        ) : null}
        <div
          ref={utilityRef}
          className="cd-utility"
          style={{ width: utilityOpen ? utilityWidth : 0 }}
          inert={!utilityOpen}
          data-startup
        >
          <div className="cd-utility-inner" style={{ width: utilityWidth }}>
            <UtilityPanel />
          </div>
        </div>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}