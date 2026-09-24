// Logging facade. Verbose in development, quiet in production.
// Rule: never log API keys, tokens, passwords, secret values or sensitive file contents.
type Level = "debug" | "info" | "warn" | "error";

const RANK: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN: Level = import.meta.env.DEV ? "debug" : "warn";
const SENSITIVE = /key|token|secret|password|authorization/i;

function redact(data: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!data) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(data).map(([name, value]) => [name, SENSITIVE.test(name) ? "[redacted]" : value]),
  );
}

function emit(level: Level, scope: string, message: string, data?: Record<string, unknown>) {
  if (RANK[level] < RANK[MIN]) {
    return;
  }
  const line = `[${scope}] ${message}`;
  const safe = redact(data);
  const sink = level === "debug" ? console.debug : console[level];
  if (safe) {
    sink(line, safe);
  } else {
    sink(line);
  }
}

export const log = {
  debug: (scope: string, message: string, data?: Record<string, unknown>) =>
    emit("debug", scope, message, data),
  info: (scope: string, message: string, data?: Record<string, unknown>) =>
    emit("info", scope, message, data),
  warn: (scope: string, message: string, data?: Record<string, unknown>) =>
    emit("warn", scope, message, data),
  error: (scope: string, message: string, data?: Record<string, unknown>) =>
    emit("error", scope, message, data),
} as const;