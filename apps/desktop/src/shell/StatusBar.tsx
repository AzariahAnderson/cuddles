import { useNavigate } from "@tanstack/react-router";
import { type NativeStatus, useNativeStatus } from "../native/useNativeStatus";
import { useProviderStore } from "../state/provider";
import { useWorkspaceStore } from "../state/workspace";

function label(status: NativeStatus): string {
  switch (status.state) {
    case "loading":
      return "Connecting\u2026";
    case "browser":
      return "Browser preview";
    case "ready":
      return `Native runtime ${status.info.version}`;
    case "error":
      return "Native runtime error";
  }
}

function tone(status: NativeStatus): "success" | "error" | "idle" {
  if (status.state === "ready") return "success";
  if (status.state === "error") return "error";
  return "idle";
}

export function StatusBar() {
  const status = useNativeStatus();
  const root = useWorkspaceStore((s) => s.root);
  const providers = useProviderStore((s) => s.profiles.length);
  const navigate = useNavigate();

  return (
    <footer className="cd-statusbar" data-startup>
      <div className="cd-status-group">
        <span className="cd-status-item" role="status">
          <span className="cd-dot" data-tone={tone(status)} aria-hidden="true" />
          {label(status)}
        </span>
        <span className="cd-status-item">
          {root ? (root.split(/[\\/]/).pop() ?? root) : "No workspace"}
        </span>
      </div>
      <div className="cd-status-group">
        <button
          type="button"
          className="cd-status-item"
          onClick={() => void navigate({ to: "/settings/providers" })}
        >
          {providers > 0
            ? `${providers} provider${providers === 1 ? "" : "s"}`
            : "No provider connected"}
        </button>
      </div>
    </footer>
  );
}