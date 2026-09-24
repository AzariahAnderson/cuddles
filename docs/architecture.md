# Architecture overview

Cuddles is a desktop application: a Tauri 2 runtime hosting an unprivileged React UI, with a Rust core
that owns every privileged operation. See docs/adr/0001-foundation-decisions.md for the reasoning.

## Layers

    React UI (renderer, unprivileged)
       |  typed facade: native.*  (Zod-validated)
    Tauri IPC (capabilities + scopes, deny by default)
       |
    Rust core (privileged)
       Workspace | Filesystem | Process | Terminal | Secrets | Database
       Git | Permission | Agent (future) | Platform

## Repository layout

    apps/desktop/            Vite + React app and src-tauri/ (Rust, Tauri config, capabilities)
    packages/ui/             application components built on our primitives
    packages/design-system/  tokens (CSS variables), primitives, motion utilities
    packages/types/          shared domain types, error model, IPC contract types
    packages/state/          Zustand stores, one per domain
    packages/commands/       CommandRegistry and ShortcutRegistry
    packages/ai-core/        AIProvider interface, provider registry (no networking in Phase 1)
    packages/workspace/      workspace abstraction and project adapters
    packages/editor/         EditorService wrapping Monaco (lazy)
    packages/terminal/       terminal surface wrapping xterm.js (lazy)
    packages/config/         shared tsconfig / tooling presets
    docs/  tests/  .github/

Deviation from the original sketch: src-tauri sits inside apps/desktop (the Tauri CLI convention).
A root Cargo workspace can be added later if the Rust core is split into multiple crates.

## Security boundary

- The renderer has no direct filesystem, shell, process, network or secret access.
- Tauri capabilities are minimal per window; scopes are explicit.
- All privileged work is a named, typed Rust command. No generic shell endpoint exists.
- Secrets stay in OS credential stores behind SecretsStore and never enter logs, chat history or config files.
- Future agent execution and future computer control are separate subsystems with separate permission domains.

## IPC model

    native.<domain>.<verb>(input) -> Result<Output, AppError>

- Domains: workspace, settings, secrets, process, terminal (more later).
- Inputs and outputs are Zod schemas shared with the Rust command signatures.
- In Phase 1 unimplemented commands return a typed NotImplemented/disabled state, never fabricated data.

## Error model

Discriminated union on kind: ValidationError, PermissionError, ProviderError, NetworkError,
WorkspaceError, FilesystemError, ProcessError, TerminalError, AgentError, InternalError.
No thrown strings. Rust errors (thiserror) map 1:1 to the TS union.

## Domain model outline (entities, not schemas yet)

project, workspace, conversation, message, providerProfile, model, setting, command,
agentRun, toolCall, permission, snapshot, fileReference.
Schemas and migrations are added when the owning feature is built.

## UI architecture

- Design tokens (CSS custom properties): colour, spacing, radii, type scale, shadows, borders, motion,
  z-index, panel/editor/toolbar dimensions. Dark-first; light theme supported by token swap.
- Primitives first (Box, Stack, Text, Icon, Surface, Button, IconButton, Input, Kbd, ScrollArea, ...),
  then composed components (AppShell, Sidebar, ChatPanel, Composer, CommandPalette, ...).
- Custom resizable split system (horizontal/vertical, min/max, collapse, keyboard resize).
- Routes share one shell: /workspace /chat /editor /terminal /search /settings/{providers,appearance,keybindings}.
- Heavy areas (Monaco, terminal, settings) are lazy-loaded.

## State architecture

One small Zustand store per domain (ui, workspace, editor, terminal, chat, provider, settings, command,
permission, agent) with selectors. Async native data uses TanStack Query only where caching helps.

## Provider abstraction

AIProvider { metadata, authentication, models, capabilities, streaming, chat, toolSupport,
structuredOutput, cancellation }. Adapters (OpenAI, Anthropic, Gemini, OpenRouter, Groq, Ollama,
OpenAI-compatible) are added later. Custom endpoints are first-class.

## Future agent (not built in Phase 1)

User request -> planner -> context builder -> provider -> tool decision -> PermissionService ->
tool execution -> observation -> provider -> result. Tools are typed and individually permissioned.
UI reserves states: plan, working, waiting for permission, running command, editing files,
review required, completed, failed, cancelled. File changes are proposed as diffs and never applied silently.

## Phase 1 non-goals

Agent, computer control, AI networking, PTY, arbitrary command execution, telemetry, accounts,
hosted backend, and any fabricated data or output.