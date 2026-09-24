import {
  Badge,
  Button,
  EmptyState,
  FolderOpen,
  Icon,
  KeyRound,
  type LucideIcon,
  MessageSquare,
  Plus,
  Text,
  Tooltip,
} from "@cuddles/design-system";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCommands } from "../../commands/registry";
import { Page, Section } from "../../shell/Page";
import { Keys } from "../../shell/Shortcut";
import { useProviderStore } from "../../state/provider";
import { useWorkspaceStore } from "../../state/workspace";

function Row({
  icon,
  title,
  description,
  trailing,
}: {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly trailing: ReactNode;
}) {
  return (
    <div className="cd-row">
      <span className="cd-row-icon">
        <Icon icon={icon} size={16} />
      </span>
      <div className="cd-row-main">
        <Text variant="title">{title}</Text>
        <Text variant="secondary">{description}</Text>
      </div>
      <div className="cd-row-trailing">{trailing}</div>
    </div>
  );
}

export function WorkspacePage() {
  const navigate = useNavigate();
  const providers = useProviderStore((s) => s.profiles.length);
  const recent = useWorkspaceStore((s) => s.recent);
  const commands = useCommands();
  const shortcuts = commands.filter((command) => command.shortcut !== undefined).slice(0, 6);

  return (
    <Page title="Workspace">
      <div className="cd-hero" data-scroll-reveal>
        <Text as="h2" variant="display">
          Open a project to begin.
        </Text>
        <Text as="p" variant="secondary" className="cd-hero-lede">
          Cuddles is local-first. Your projects, keys and conversations stay on this machine, and
          you choose which model does the work.
        </Text>
        <div className="cd-hero-actions">
          <Tooltip label="Needs the native workspace service">
            <Button variant="primary" size="lg" icon={FolderOpen} disabled>
              Open folder
            </Button>
          </Tooltip>
          <Tooltip label="Needs the native workspace service">
            <Button size="lg" icon={Plus} disabled>
              New workspace
            </Button>
          </Tooltip>
        </div>
      </div>

      <Section title="Get set up">
        <div className="cd-list">
          <Row
            icon={KeyRound}
            title="Connect an AI provider"
            description="Bring your own key, or a local endpoint such as Ollama or LM Studio."
            trailing={
              <>
                {providers > 0 ? (
                  <Badge tone="success">Connected</Badge>
                ) : (
                  <Badge>Not connected</Badge>
                )}
                <Button size="sm" onClick={() => void navigate({ to: "/settings/providers" })}>
                  Configure
                </Button>
              </>
            }
          />
          <Row
            icon={MessageSquare}
            title="Start a conversation"
            description="Open the assistant and try the composer."
            trailing={
              <Button size="sm" onClick={() => void navigate({ to: "/chat" })}>
                Open assistant
              </Button>
            }
          />
        </div>
      </Section>

      <Section title="Recent projects">
        {recent.length === 0 ? (
          <div className="cd-list">
            <EmptyState
              compact
              icon={FolderOpen}
              title="No recent projects"
              description="Projects you open will appear here."
            />
          </div>
        ) : (
          <div className="cd-list">
            {recent.map((project) => (
              <Row
                key={project.path}
                icon={FolderOpen}
                title={project.name}
                description={project.path}
                trailing={null}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Keyboard">
        <div className="cd-list">
          {shortcuts.map((command) => (
            <div key={command.id} className="cd-row cd-row-tight">
              <div className="cd-row-main">
                <Text variant="body">{command.title}</Text>
              </div>
              {command.shortcut ? <Keys combo={command.shortcut} /> : null}
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}