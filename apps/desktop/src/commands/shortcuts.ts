const MODIFIER_KEYS = new Set(["Control", "Shift", "Alt", "Meta"]);

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

/** Canonical combo for a keyboard event, or null for bare modifier presses. */
export function eventToCombo(event: KeyboardEvent): string | null {
  if (MODIFIER_KEYS.has(event.key)) {
    return null;
  }
  const parts: string[] = [];
  if (isMac ? event.metaKey : event.ctrlKey) parts.push("Mod");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("Shift");
  parts.push(event.key.length === 1 ? event.key.toUpperCase() : event.key);
  return parts.join("+");
}

/** Human-readable key labels for a canonical combo. */
export function formatShortcut(combo: string): readonly string[] {
  return combo.split("+").map((part) => {
    switch (part) {
      case "Mod":
        return isMac ? "\u2318" : "Ctrl";
      case "Alt":
        return isMac ? "\u2325" : "Alt";
      case "Shift":
        return isMac ? "\u21E7" : "Shift";
      default:
        return part;
    }
  });
}