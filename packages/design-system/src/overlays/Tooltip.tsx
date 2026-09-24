import { type ReactElement, useEffect, useRef, useState } from "react";
import { usePresence } from "../motion";
import { Kbd } from "../primitives/Controls";
import { Portal } from "./Portal";

export interface TooltipProps {
  readonly label: string;
  readonly shortcut?: readonly string[];
  readonly side?: "top" | "bottom" | "right";
  readonly children: ReactElement;
}

const SHOW_DELAY_MS = 380;

export function Tooltip({ label, shortcut, side = "bottom", children }: TooltipProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { ref, mounted } = usePresence<HTMLDivElement>(open, "tip");

  const show = (immediate: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => {
        const el = anchor.current;
        if (!el) {
          return;
        }
        const rect = el.getBoundingClientRect();
        if (side === "right") {
          setPos({ x: rect.right + 8, y: rect.top + rect.height / 2 });
        } else {
          const x = Math.min(Math.max(rect.left + rect.width / 2, 80), window.innerWidth - 80);
          setPos({ x, y: side === "bottom" ? rect.bottom + 6 : rect.top - 6 });
        }
        setOpen(true);
      },
      immediate ? 0 : SHOW_DELAY_MS,
    );
  };

  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <span
      ref={anchor}
      className="cd-tip-anchor"
      onPointerEnter={() => show(false)}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={() => show(true)}
      onBlur={hide}
    >
      {children}
      {mounted ? (
        <Portal>
          <div
            ref={ref}
            role="tooltip"
            className="cd-tip"
            data-side={side}
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="cd-tip-body">
              {label}
              {shortcut ? (
                <span className="cd-tip-keys">
                  {shortcut.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </span>
              ) : null}
            </div>
          </div>
        </Portal>
      ) : null}
    </span>
  );
}