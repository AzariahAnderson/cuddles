import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ChatPage } from "./features/chat/ChatPage";
import { EditorPage } from "./features/editor/EditorPage";
import { WorkspacePage } from "./features/home/WorkspacePage";
import { PlannedPage } from "./features/planned/PlannedPage";
import { SearchPage } from "./features/search/SearchPage";
import { AppearancePage } from "./features/settings/AppearancePage";
import { KeybindingsPage } from "./features/settings/KeybindingsPage";
import { ProvidersPage } from "./features/settings/ProvidersPage";
import { TerminalPage } from "./features/terminal/TerminalPage";
import { AppShell } from "./shell/AppShell";

const rootRoute = createRootRoute({ component: AppShell });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/workspace" });
  },
});

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workspace",
  component: WorkspacePage,
});
const chatRoute = createRoute({ getParentRoute: () => rootRoute, path: "/chat", component: ChatPage });
const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor",
  component: EditorPage,
});
const terminalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terminal",
  component: TerminalPage,
});
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
});
const sourceControlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/source-control",
  component: () => <PlannedPage area="source-control" />,
});
const runRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/run",
  component: () => <PlannedPage area="run" />,
});
const extensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/extensions",
  component: () => <PlannedPage area="extensions" />,
});

const settingsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  beforeLoad: () => {
    throw redirect({ to: "/settings/providers" });
  },
});
const providersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/providers",
  component: ProvidersPage,
});
const appearanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/appearance",
  component: AppearancePage,
});
const keybindingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/keybindings",
  component: KeybindingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  workspaceRoute,
  chatRoute,
  editorRoute,
  terminalRoute,
  searchRoute,
  sourceControlRoute,
  runRoute,
  extensionsRoute,
  settingsIndexRoute,
  providersRoute,
  appearanceRoute,
  keybindingsRoute,
]);

// Hash history: works under the Tauri asset protocol without server-side rewrites.
export const router = createRouter({ routeTree, history: createHashHistory() });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}