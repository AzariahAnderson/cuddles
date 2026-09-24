# Desktop runtime

The Rust crate lives in `apps/desktop/src-tauri`. The library is `cuddles_lib`; `main.rs` only calls `run()`.

| Service (conceptual)              | Module        | Status  |
| --------------------------------- | ------------- | ------- |
| PermissionService                 | `security/`   | planned |
| SecretsService, DatabaseService   | `storage/`    | planned |
| WorkspaceService, FilesystemService, GitService | `workspace/` | planned |
| ProcessService                    | `process/`    | planned |
| TerminalService                   | `terminal/`   | planned |
| AgentService                      | `agent/`      | planned |
| PlatformService                   | `platform/`   | planned |

## Command security

- Custom commands are listed in `build.rs` (`AppManifest::commands`), which makes them deny-by-default.
- A command becomes callable only when a capability file grants `allow-<command-name>`.
- `capabilities/default.json` grants `core:default` and `allow-app-info` only: no fs, shell, process or network plugins.
- Production CSP is strict. `devCsp` is `null` for now and will be tightened when Monaco workers are added.

## Errors and logging

- `AppError` (`error.rs`) is the single error type; it serialises as `{ "kind": ... }`.
- `logging.rs` uses `tracing`; set `CUDDLES_LOG` to override levels. Secrets are never logged.

## Placeholder icon

`apps/desktop/assets/app-icon.png` is a generated placeholder. Replace it and run
`pnpm --filter @cuddles/desktop exec tauri icon assets/app-icon.png`.