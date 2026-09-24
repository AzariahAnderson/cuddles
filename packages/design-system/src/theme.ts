import { useEffect, useState } from "react";

export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

const LIGHT_QUERY = "(prefers-color-scheme: light)";

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") {
    return preference;
  }
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

export function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);
  document.documentElement.dataset.theme = resolved;
  return resolved;
}

/** Applies the theme to <html> and follows OS changes while preference is "system".
 *  Persistence moves to the settings store (native SQLite) in a later phase. */
export function useThemePreference(
  initial: ThemePreference = "dark",
): readonly [ThemePreference, (next: ThemePreference) => void] {
  const [preference, setPreference] = useState<ThemePreference>(initial);

  useEffect(() => {
    applyTheme(preference);
    if (preference !== "system") {
      return undefined;
    }
    const query = window.matchMedia(LIGHT_QUERY);
    const onChange = () => applyTheme("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [preference]);

  return [preference, setPreference] as const;
}
