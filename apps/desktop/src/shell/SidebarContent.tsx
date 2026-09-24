import {
  Button,
  EmptyState,
  FolderOpen,
  Icon,
  IconButton,
  Keyboard,
  KeyRound,
  MessageSquare,
  Palette,
  PanelHeader,
  Search,
  SquarePen,
  Tooltip,
} from "@cuddles/design-system";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { PLANNED } from "../features/planned/PlannedPage";
import { useChatStore } from "../state/chat";

function ExplorerSidebar() {
  return (
    <>
      <PanelHeader title="Explorer" />
      <div className="cd-panelbody">
        <EmptyState
          compact
          icon={FolderOpen}
          title="No folder opened"
          description="Open a project to browse its files."
        >
          <Tooltip label="Needs the native workspace service">
            <Button variant="primary" size="sm" icon={FolderOpen} disabled>
              Open folder
            </Button>
          </Tooltip>
        </EmptyState>
      </div>
    </>
  );
}

function ConversationsSidebar() {
  const navigate = useNavigate();
  const reset = useChatStore((s) => s.resetConversation);
  return (
    <>
      <PanelHeader
        title="Conversations"
        actions={
          <IconButton
            icon={SquarePen}
            label="New conversation"
            size="sm"
            onClick={() => {
              reset();
              void navigate({ to: "/chat" });
            }}
          />
        }
      />
      <div className="cd-panelbody">
        <EmptyState
          compact
          icon={MessageSquare}
          title="No conversations yet"
          description="Conversations are stored locally on this machine."
        />
      </div>
    </>
  );
}

function SearchSidebar() {
  return (
    <>
      <PanelHeader title="Search" />
      <div className="cd-panelbody">
        <EmptyState
          compact
          icon={Search}
          title="Nothing to search"
          description="Open a project to search its files."
        />
      </div>
    </>
  );
}

function PlannedSidebar({ area }: { readonly area: keyof typeof PLANNED }) {
  const copy = PLANNED[area];
  return (
    <>
      <PanelHeader title={copy.title} />
      <div className="cd-panelbody">
        <EmptyState compact icon={copy.icon} title="Not built yet" description={copy.text} />
      </div>
    </>
  );
}

function SettingsSidebar() {
  const links = [
    { to: "/settings/providers", label: "Providers", icon: KeyRound },
    { to: "/settings/appearance", label: "Appearance", icon: Palette },
    { to: "/settings/keybindings", label: "Keyboard shortcuts", icon: Keyboard },
  ] as const;
  return (
    <>
      <PanelHeader title="Settings" />
      <nav className="cd-panelbody cd-navlist" aria-label="Settings sections">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="cd-navlink">
            <Icon icon={link.icon} size={16} />
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

export function SidebarContent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const area = pathname.split("/")[1] ?? "";
  switch (area) {
    case "chat":
      return <ConversationsSidebar />;
    case "settings":
      return <SettingsSidebar />;
    case "search":
      return <SearchSidebar />;
    case "source-control":
    case "run":
    case "extensions":
      return <PlannedSidebar area={area} />;
    default:
      return <ExplorerSidebar />;
  }
}