import type { LucideIcon } from "lucide-react";
import { type KeyboardEvent, type ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { Check } from "../icons";
import { usePresence } from "../motion";
import { Icon } from "../primitives/Icon";
import { Portal } from "./Portal";

export type MenuEntry =
  | {
      readonly kind: "item";
      readonly id: string;
      readonly label: string;
      readonly icon?: LucideIcon;
      readonly shortcut?: readonly string[];
      readonly disabled?: boolean;
      readonly checked?: boolean;
      readonly onSelect: () => void;
    }
  | { readonly kind: "separator"; readonly id: string }
  | { readonly kind: "label"; readonly id: string; readonly label: string };

export interface DropdownMenuProps {
  readonly label: string;
  readonly entries: readonly MenuEntry[];
  readonly trigger: (state: { readonly open: boolean; readonly toggle: () => void }) => ReactElement;
  readonly align?: "start" | "end";
  readonly minWidth?: number;
}

interface Position {
  readonly top: number;
  readonly left: number | null;
  readonly right: number | null;
}

const ITEM_SELECTOR = '[role^="menuitem"]:not([aria-disabled="true"])';

export function DropdownMenu({
  label,
  entries,
  trigger,
  align = "start",
  minWidth = 208,
}: DropdownMenuProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Position>({ top: 0, left: 0, right: null });
  const { ref, mounted } = usePresence<HTMLDivElement>(open, "pop");

  const restoreFocus = useCallback(() => {
    anchor.current?.querySelector<HTMLElement>("button, a[href], [tabindex]")?.focus();
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      setOpen(false);
      return;
    }
    const el = anchor.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setPos(
        align === "end"
          ? { top: rect.bottom + 6, left: null, right: window.innerWidth - rect.right }
          : {
              top: rect.bottom + 6,
              left: Math.max(8, Math.min(rect.left, window.innerWidth - minWidth - 8)),
              right: null,
            },
      );
    }
    setOpen(true);
  }, [open, align, minWidth]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    ref.current?.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (ref.current?.contains(target) || anchor.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, ref]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    const current = items.findIndex((item) => item === document.activeElement);
    const focusAt = (index: number) => {
      event.preventDefault();
      items[(index + items.length) % items.length]?.focus();
    };
    switch (event.key) {
      case "ArrowDown":
        if (items.length > 0) focusAt(current + 1);
        break;
      case "ArrowUp":
        if (items.length > 0) focusAt(current < 0 ? items.length - 1 : current - 1);
        break;
      case "Home":
        if (items.length > 0) focusAt(0);
        break;
      case "End":
        if (items.length > 0) focusAt(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        restoreFocus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <span ref={anchor} className="cd-menu-anchor">
        {trigger({ open, toggle })}
      </span>
      {mounted ? (
        <Portal>
          <div
            ref={ref}
            role="menu"
            aria-label={label}
            className="cd-menu"
            style={{ top: pos.top, left: pos.left ?? "auto", right: pos.right ?? "auto", minWidth }}
            onKeyDown={onKeyDown}
          >
            {entries.map((entry) => {
              if (entry.kind === "separator") {
                return <div key={entry.id} role="separator" className="cd-menu-sep" />;
              }
              if (entry.kind === "label") {
                return (
                  <div key={entry.id} className="cd-menu-label">
                    {entry.label}
                  </div>
                );
              }
              const radio = entry.checked !== undefined;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role={radio ? "menuitemradio" : "menuitem"}
                  aria-checked={radio ? entry.checked : undefined}
                  aria-disabled={entry.disabled ? true : undefined}
                  tabIndex={-1}
                  className="cd-menu-item"
                  onClick={() => {
                    if (entry.disabled) {
                      return;
                    }
                    setOpen(false);
                    restoreFocus();
                    entry.onSelect();
                  }}
                >
                  <span className="cd-menu-icon">
                    {entry.icon ? <Icon icon={entry.icon} size={16} /> : null}
                  </span>
                  <span className="cd-menu-text">{entry.label}</span>
                  {entry.shortcut ? (
                    <span className="cd-menu-shortcut">{entry.shortcut.join(" ")}</span>
                  ) : null}
                  {entry.checked ? <Icon icon={Check} size={14} /> : null}
                </button>
              );
            })}
          </div>
        </Portal>
      ) : null}
    </>
  );
}