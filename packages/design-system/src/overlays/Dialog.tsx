import { type ReactNode, useEffect, useId, useLayoutEffect, useRef } from "react";
import { X } from "../icons";
import { usePresence } from "../motion";
import { IconButton } from "../primitives/Controls";
import { Text } from "../primitives/Text";
import { Portal } from "./Portal";

export interface DialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly description?: string;
  readonly width?: number;
  readonly variant?: "dialog" | "palette";
  readonly footer?: ReactNode;
  readonly children: ReactNode;
}

const FOCUSABLE = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function Dialog({
  open,
  onClose,
  title,
  description,
  width = 520,
  variant = "dialog",
  footer,
  children,
}: DialogProps) {
  const { ref, mounted } = usePresence<HTMLDivElement>(open, "modal");
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();
  const palette = variant === "palette";

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const active = document.activeElement;
    returnFocus.current = active instanceof HTMLElement ? active : null;
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const initial = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? panel;
    initial?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) {
        event.preventDefault();
        return;
      }
      const inside = panel?.contains(document.activeElement) ?? false;
      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      returnFocus.current?.focus();
    };
  }, [open]);

  if (!mounted) {
    return null;
  }

  return (
    <Portal>
      <div
        ref={ref}
        className="cd-overlay"
        role="presentation"
        data-variant={variant}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          ref={panelRef}
          data-panel
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className="cd-dialog"
          style={{ width }}
        >
          {palette ? (
            <h2 id={titleId} className="cd-visually-hidden">
              {title}
            </h2>
          ) : (
            <div className="cd-dialog-head">
              <div className="cd-dialog-heading">
                <Text as="h2" variant="heading">
                  <span id={titleId}>{title}</span>
                </Text>
                {description ? (
                  <Text as="p" variant="secondary">
                    <span id={descriptionId}>{description}</span>
                  </Text>
                ) : null}
              </div>
              <IconButton icon={X} label="Close dialog" size="sm" onClick={onClose} />
            </div>
          )}
          <div className={palette ? "cd-dialog-bare" : "cd-dialog-body"}>{children}</div>
          {footer ? <div className="cd-dialog-foot">{footer}</div> : null}
        </div>
      </div>
    </Portal>
  );
}