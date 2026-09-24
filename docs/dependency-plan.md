# Dependency plan

Latest published versions as of 2026-09-24 (queried live from npm and crates.io).
"Latest" is not automatically "adopt": each package is pinned only when its phase begins,
after checking peer-dependency compatibility and that the release is stable (not alpha/beta/rc).

| Package | Registry | Latest |
| --- | --- | --- |
| react | npm | 19.3.0 |
| react-dom | npm | 19.3.0 |
| vite | npm | 8.3.1 |
| @vitejs/plugin-react | npm | 6.1.1 |
| typescript | npm | 7.0.2 |
| tailwindcss | npm | 4.3.3 |
| @tailwindcss/vite | npm | 4.3.3 |
| gsap | npm | 3.15.0 |
| zustand | npm | 5.0.15 |
| @tanstack/react-router | npm | 1.170.39 |
| @tanstack/react-query | npm | 5.103.2 |
| zod | npm | 4.6.5 |
| monaco-editor | npm | 0.56.0 |
| @monaco-editor/react | npm | 4.7.0 |
| @xterm/xterm | npm | 6.0.0 |
| @xterm/addon-fit | npm | 0.11.0 |
| lucide-react | npm | 1.48.0 |
| vitest | npm | 5.0.1 |
| @testing-library/react | npm | 16.3.3 |
| @playwright/test | npm | 1.63.0 |
| @tauri-apps/cli | npm | 2.11.5 |
| @tauri-apps/api | npm | 2.11.1 |
| @biomejs/biome | npm | 2.5.14 |
| tauri | crates.io | 2.11.6 (latest stable 2.x; 3.x is alpha and NOT adopted) |
| tauri-build | crates.io | 2.6.3 (latest stable 2.x; 3.x is alpha and NOT adopted) |
| serde | crates.io | 1.0.229 |
| thiserror | crates.io | 2.0.21 |
| tracing | crates.io | 0.1.44 |
| rusqlite | crates.io | 0.40.2 |
| keyring | crates.io | 4.2.0 |

## Justification per dependency

| Package | Why it earns its place |
| --- | --- |
| react, react-dom | UI runtime chosen in ADR-0001 (D2). |
| vite, @vitejs/plugin-react | Fast dev server and production bundler for the Tauri webview. |
| typescript | Strict typing across the IPC boundary and shared domain types. |
| tailwindcss, @tailwindcss/vite | Utility CSS bound to our own design tokens (CSS variables); not a component kit. |
| gsap | Deliberate, centralised motion layer (ADR-0001 D8). |
| zustand | Small domain-scoped client-state stores (ADR-0001 D5). |
| @tanstack/react-router | Typed routes for /workspace, /chat, /settings/... |
| @tanstack/react-query | Only for genuinely async/cacheable native calls, not general state. |
| zod | Runtime validation at the IPC and config boundaries. |
| monaco-editor (+ wrapper if needed) | Editor foundation, lazy-loaded behind our EditorService (ADR-0001 D6). |
| @xterm/xterm, @xterm/addon-fit | Terminal surface, lazy-loaded; PTY is a later phase. |
| lucide-react | Permissively licensed base icons, wrapped by our own Icon primitive. |
| vitest, @testing-library/react, @playwright/test | Unit/component/e2e test foundation. |
| @tauri-apps/cli, @tauri-apps/api | Desktop build tooling and the low-level bridge we wrap in a typed facade. |
| @biomejs/biome | Single formatter + linter; avoids ESLint+Prettier duplication. |
| tauri, tauri-build | Native runtime. |
| serde, thiserror, tracing | Serialisation, unified error model, structured logging with redaction. |
| rusqlite | SQLite from the native layer (evaluated against sqlx at that phase). |
| keyring | OS credential stores (Credential Manager / Keychain / Secret Service). |