import {
  ArrowUp,
  Button,
  Cpu,
  DropdownMenu,
  Icon,
  IconButton,
  KeyRound,
  type MenuEntry,
  Plus,
  Tooltip,
} from "@cuddles/design-system";
import { useNavigate } from "@tanstack/react-router";
import { type KeyboardEvent, useLayoutEffect, useRef } from "react";
import { useChatStore } from "../../state/chat";
import { useProviderStore } from "../../state/provider";

const noop = (): void => undefined;

const CONTEXT_MODES = [
  { id: "file", label: "File", token: "@file" },
  { id: "folder", label: "Folder", token: "@folder" },
  { id: "selection", label: "Selection", token: "@selection" },
  { id: "terminal", label: "Terminal output", token: "@terminal" },
  { id: "error", label: "Error", token: "@error" },
  { id: "project", label: "Project", token: "@project" },
] as const;

const contextEntries: readonly MenuEntry[] = [
  { kind: "label", id: "label", label: "Add context (needs a workspace)" },
  ...CONTEXT_MODES.map((mode) => ({
    kind: "item" as const,
    id: mode.id,
    label: mode.label,
    shortcut: [mode.token],
    disabled: true,
    onSelect: noop,
  })),
];

export function Composer() {
  const draft = useChatStore((s) => s.draft);
  const setDraft = useChatStore((s) => s.setDraft);
  const hasProvider = useProviderStore((s) => s.profiles.length > 0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    if (draft.length > 0) {
      el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    }
  }, [draft]);

  const modelEntries: readonly MenuEntry[] = [
    { kind: "label", id: "label", label: "Model" },
    { kind: "item", id: "none", label: "No models available", disabled: true, onSelect: noop },
    { kind: "separator", id: "sep" },
    {
      kind: "item",
      id: "configure",
      label: "Configure providers\u2026",
      icon: KeyRound,
      onSelect: () => void navigate({ to: "/settings/providers" }),
    },
  ];

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Sending is wired in the AI phase. Enter must not insert a newline (Shift+Enter does).
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <div className="cd-composer" role="group" aria-label="Message composer">
        <textarea
          ref={inputRef}
          className="cd-composer-input"
          rows={1}
          value={draft}
          placeholder="Ask about your project, or describe what to build"
          aria-label="Message"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="cd-composer-foot">
          <div className="cd-composer-tools">
            <DropdownMenu
              label="Add context"
              entries={contextEntries}
              trigger={({ open, toggle }) => (
                <Tooltip label="Add context" side="top">
                  <IconButton
                    icon={Plus}
                    label="Add context"
                    size="sm"
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={toggle}
                  />
                </Tooltip>
              )}
            />
            <DropdownMenu
              label="Model"
              entries={modelEntries}
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  className="cd-chip"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  onClick={toggle}
                >
                  <Icon icon={Cpu} size={14} />
                  No model
                </button>
              )}
            />
          </div>
          <Tooltip
            label={hasProvider ? "Sending arrives in the AI phase" : "Connect an AI provider to send"}
            side="top"
          >
            <IconButton icon={ArrowUp} label="Send message" className="cd-send" disabled />
          </Tooltip>
        </div>
      </div>
      {hasProvider ? null : (
        <p className="cd-composer-hint">
          Connect a provider to send messages.
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void navigate({ to: "/settings/providers" })}
          >
            Configure providers
          </Button>
        </p>
      )}
    </div>
  );
}