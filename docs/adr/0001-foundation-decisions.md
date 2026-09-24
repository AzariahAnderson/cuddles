# ADR-0001: Foundation decisions

Status: Accepted (Phase 1)

## Context

Cuddles is a local-first, privacy-first, open-source, model-agnostic desktop environment for
AI-assisted development. A future agent will read/write files, run commands and interact with Git,
so the architecture must make privileged capabilities explicit, narrow and observable from day one.
Phase 1 builds the foundation only: shell, design system, typed boundaries, docs. It contains no agent,
no AI networking, no PTY and no computer control.

## Decisions

### D1. Tauri 2 (not Electron)
- Native Rust core owns privileged operations; the webview is an unprivileged renderer.
- Capabilities and scopes are deny-by-default, which matches our permission model.
- Small installers and low idle memory suit an always-open developer tool.
- Rejected: Electron. Bundles Chromium and Node; the renderer-to-Node boundary is easy to weaken,
  and the footprint is much larger. Its ecosystem maturity does not outweigh the security posture we want.

### D2. React + TypeScript (strict)
- Largest hiring/contributor pool for an open-source project; strong ecosystem for editor and terminal embeds.
- Strict TS lets the IPC contract and domain model be checked at compile time.
- Rejected: Next.js as the desktop shell. Its server/routing/SSR model solves problems a local
  desktop runtime does not have and adds a second runtime we would need to secure.
- Rejected: browser-only architecture. Cannot provide a native privilege boundary, secure secret storage
  or real process/PTY management.

### D3. Rust native core
- Memory-safe systems language for filesystem, process, terminal, secrets and database services.
- Services are separate modules (Workspace, Filesystem, Process, Terminal, Secrets, Database, Git,
  Agent, Permission, Platform); main.rs stays tiny.

### D4. Vite
- Fast HMR and a simple static build that Tauri serves. No server runtime required.

### D5. Zustand for client state
- Small, selector-based stores split by domain (ui, workspace, editor, terminal, chat, provider,
  settings, command, permission, agent) to limit rerenders and coupling.
- TanStack Query is used only where async/cache semantics help. Zustand is not a data-fetching layer.
- Rejected: Redux (ceremony), one global store (coupling), uncontrolled React context (rerenders).

### D6. Monaco Editor behind an internal EditorService
- Do not write a text editor. Monaco gives multi-language support, diffs, minimap and search.
- All product code depends on our EditorService/Editor component, never on Monaco directly, and Monaco is lazy-loaded.

### D7. SQLite in the native layer
- Local-first structured storage (projects, conversations, messages, provider profiles, agent runs,
  permissions) with no hosted backend. Migrations are versioned and owned by Rust.
- Rejected: cloud database, IndexedDB/localStorage as the source of truth (not durable or private enough,
  and not accessible to native services).

### D8. GSAP for deliberate motion
- One centralised motion layer (transitions, panels, modals, menus, startup) with reduced-motion support.
- Motion is never scattered across components and there are no permanent animation loops.
- Rejected: Three.js/WebGL decoration (cost and noise with no product value), ad-hoc CSS animation everywhere.

### D9. Provider abstraction
- The UI depends on an internal AIProvider interface (metadata, auth, models, capabilities, streaming,
  chat, tool support, structured output, cancellation). Vendors are adapters behind it.
- OpenAI-compatible custom endpoints are first-class, which covers Ollama, LM Studio and self-hosted servers.
- Rejected: hardcoding OpenAI, Anthropic or OpenRouter into the UI or state.

### D10. Native secure secret storage
- API keys live only in OS credential stores through a SecretsStore abstraction owned by Rust.
- The renderer never receives secrets except transiently when strictly required. Secrets are never written
  to localStorage, JSON config, SQLite plaintext, logs or chat history.
- Rejected: storing keys in config files or browser storage.

### D11. Typed IPC boundary
- React calls a facade (native.workspace.*, native.settings.*, native.secrets.*, native.process.*,
  native.terminal.*), never raw invoke(). Requests and responses are validated with Zod.
- Every command is narrow and explicit; there is no generic "run any shell command" endpoint exposed to the UI.
- Rejected: scattered invoke() calls; direct renderer filesystem or shell access.

### D12. Permission architecture designed now, activated later
- Scopes: read workspace, write workspace, execute command, network, Git mutation, delete files,
  install packages, launch applications, computer control (separate domain).
- Decisions: allow once / session / workspace / always; deny once / permanently.
- Every privileged action passes a Rust PermissionService and is logged. Phase 1 activates none of it.

## Other rejected alternatives
- Large UI frameworks or dashboard kits (shadcn/ui as identity, MUI, Ant): the visual identity must be our own;
  we use headless primitives only where they solve real accessibility problems.
- Mandatory hosted backend, accounts, telemetry: contradicts local-first, privacy-first and open source.

## Consequences
- More up-front structure (typed IPC, service modules) in exchange for a foundation that scales to hundreds of features.
- We own our design system and interaction layer, which costs effort but gives a distinct, consistent product.