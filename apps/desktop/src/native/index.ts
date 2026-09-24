// The ONLY file in the renderer allowed to import from @tauri-apps/api.
// Every other module depends on the `native` facade. A later phase replaces this bootstrap with
// the full typed, Zod-validated facade (native.workspace.*, native.settings.*, ...).
import { invoke } from "@tauri-apps/api/core";

export interface AppInfo {
  readonly name: string;
  readonly version: string;
  readonly os: string;
  readonly arch: string;
}

export function isNativeRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export const native = {
  app: {
    info: (): Promise<AppInfo> => invoke<AppInfo>("app_info"),
  },
} as const;
