import { useEffect, useState } from "react";
import { type AppInfo, isNativeRuntime, native } from "./index";

export type NativeStatus =
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

export function useNativeStatus(): NativeStatus {
  const [status, setStatus] = useState<NativeStatus>(() =>
    isNativeRuntime() ? { state: "loading" } : { state: "browser" },
  );

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

  return status;
}