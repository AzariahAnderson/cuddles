import {
  Badge,
  Button,
  Divider,
  FolderOpen,
  IconButton,
  Kbd,
  Monitor,
  Moon,
  Plus,
  Stack,
  Sun,
  Surface,
  Text,
  type ThemePreference,
  useReveal,
  useThemePreference,
} from "@cuddles/design-system";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type AppInfo, isNativeRuntime, native } from "./native";

type Status =
  | { readonly state: "loading" }
  | { readonly state: "browser" }
  | { readonly state: "ready"; readonly info: AppInfo }
  | { readonly state: "error"; readonly message: string };

function describeError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    typeof error.kind === "string"
  ) {
    return error.kind;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown native error";
}

function describeStatus(status: Status): string {
  switch (status.state) {
    case "loading":
      return "Connecting to native runtime...";
    case "browser":
      return "Running in a browser. Native runtime not available.";
    case "ready":
      return `Native runtime OK: ${status.info.name} ${status.info.version} (${status.info.os}/${status.info.arch})`;
    case "error":
      return `Native runtime error: ${status.message}`;
  }
}

function initialStatus(): Status {
  return isNativeRuntime() ? { state: "loading" } : { state: "browser" };
}

const themeOptions = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
] as const;

const swatches = [
  "--bg-app",
  "--bg-sidebar",
  "--bg-surface",
  "--bg-raised",
  "--border-default",
  "--text-primary",
  "--text-secondary",
  "--text-tertiary",
  "--accent",
  "--accent-subtle",
  "--success",
  "--warning",
  "--error",
  "--info",
] as const;

function Section({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section data-reveal className="flex flex-col gap-4">
      <Text as="h2" variant="caption" className="cd-eyebrow">
        {title}
      </Text>
      {children}
    </section>
  );
}

export function App() {
  const [preference, setPreference] = useThemePreference("dark");
  const [status, setStatus] = useState<Status>(initialStatus);
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  useEffect(() => {
    if (!isNativeRuntime()) {
      return undefined;
    }
    let cancelled = false;
    native.app.info().then(
      (info) => {
        if (!cancelled) setStatus({ state: "ready", info });
      },
      (error: unknown) => {
        if (!cancelled) setStatus({ state: "error", message: describeError(error) });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={rootRef} className="cd-scroll h-full">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-12">
        <header data-reveal className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Text as="h1" variant="display">
              Cuddles
            </Text>
            <Text as="p" variant="secondary">
              Design system preview. The application shell replaces this page in the next phase.
            </Text>
          </div>
          <div role="toolbar" aria-label="Theme" className="flex gap-1">
            {themeOptions.map((option) => (
              <IconButton
                key={option.value}
                icon={option.icon}
                label={option.label}
                pressed={preference === option.value}
                onClick={() => setPreference(option.value satisfies ThemePreference)}
              />
            ))}
          </div>
        </header>

        <Section title="Typography">
          <Surface>
            <div className="flex flex-col gap-3 p-5">
              <Text variant="display">Open a project to begin.</Text>
              <Text variant="heading">Connect an AI provider.</Text>
              <Text variant="title">Start a conversation</Text>
              <Text variant="body">Body text is set in Inter for long, comfortable reading.</Text>
              <Text variant="secondary">Secondary text carries supporting detail.</Text>
              <Text variant="label">Label</Text>
              <Text variant="caption">Caption and metadata</Text>
              <Text variant="code">src/features/workspace/open.ts</Text>
            </div>
          </Surface>
        </Section>

        <Section title="Actions">
          <Stack direction="row" gap={3} align="center" wrap>
            <Button variant="primary" icon={FolderOpen}>
              Open folder
            </Button>
            <Button icon={Plus}>New workspace</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </Stack>
          <Stack direction="row" gap={3} align="center" wrap>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Stack>
        </Section>

        <Section title="Status and shortcuts">
          <Stack direction="row" gap={2} align="center" wrap>
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="error">Error</Badge>
            <Badge tone="info">Info</Badge>
          </Stack>
          <Stack direction="row" gap={2} align="center">
            <Text variant="secondary">Command palette</Text>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </Stack>
        </Section>

        <Section title="Palette (live tokens)">
          <div className="cd-swatch-grid">
            {swatches.map((name) => (
              <div key={name} className="cd-swatch-item">
                <div className="cd-swatch" style={{ background: `var(${name})` }} />
                <Text variant="code">{name}</Text>
              </div>
            ))}
          </div>
        </Section>

        <Divider />
        <Text as="p" variant="code">
          <span role="status">{describeStatus(status)}</span>
        </Text>
      </div>
    </div>
  );
}
