import { Button, EmptyState, Icon, KeyRound, Server, Text, Tooltip } from "@cuddles/design-system";
import { Page, Section } from "../../shell/Page";
import { useProviderStore } from "../../state/provider";

const KINDS = [
  { id: "openai", name: "OpenAI", note: "API key" },
  { id: "anthropic", name: "Anthropic", note: "API key" },
  { id: "gemini", name: "Google Gemini", note: "API key" },
  { id: "openrouter", name: "OpenRouter", note: "API key" },
  { id: "groq", name: "Groq", note: "API key" },
  { id: "ollama", name: "Ollama", note: "Local endpoint" },
  { id: "lmstudio", name: "LM Studio", note: "Local endpoint" },
  { id: "compatible", name: "OpenAI-compatible", note: "Custom endpoint and optional key" },
] as const;

export function ProvidersPage() {
  const profiles = useProviderStore((s) => s.profiles);
  return (
    <Page title="Providers">
      <Section title="Connected providers">
        {profiles.length === 0 ? (
          <div className="cd-list">
            <EmptyState
              compact
              icon={KeyRound}
              title="Connect an AI provider"
              description="Keys will be stored in your operating system credential store, never in files, the database or logs."
            />
          </div>
        ) : (
          <div className="cd-list">
            {profiles.map((profile) => (
              <div key={profile.id} className="cd-row">
                <div className="cd-row-main">
                  <Text variant="title">{profile.label}</Text>
                  <Text variant="secondary">{profile.kind}</Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Supported provider types">
        <div className="cd-list">
          {KINDS.map((kind) => (
            <div key={kind.id} className="cd-row">
              <span className="cd-row-icon">
                <Icon icon={Server} size={16} />
              </span>
              <div className="cd-row-main">
                <Text variant="title">{kind.name}</Text>
                <Text variant="secondary">{kind.note}</Text>
              </div>
              <Tooltip label="Needs provider networking and secure key storage">
                <Button size="sm" disabled>
                  Set up
                </Button>
              </Tooltip>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}