import { useEffect, useState } from "react";
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

export function App() {
  const [status, setStatus] = useState<Status>(initialStatus);

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
    <main className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-lg font-medium tracking-tight text-neutral-100">Cuddles</h1>
      <p className="max-w-md text-sm text-neutral-400">
        Foundation scaffold. The application shell, design system and typed native API are built in
        the next phases.
      </p>
      <p className="font-mono text-xs text-neutral-500" role="status">
        {describeStatus(status)}
      </p>
    </main>
  );
}
