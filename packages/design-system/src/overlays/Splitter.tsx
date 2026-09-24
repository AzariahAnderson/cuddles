import { type KeyboardEvent, type PointerEvent, useRef, useState } from "react";

export interface SplitterProps {
  /** "vertical" is a vertical bar that resizes width; "horizontal" resizes height. */
  readonly orientation: "vertical" | "horizontal";
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly defaultValue: number;
  readonly onChange: (value: number) => void;
  /** Called when dragged well past `min`. */
  readonly onCollapse?: () => void;
  /** Use for panels on the right or bottom: dragging toward the panel shrinks it. */
  readonly reverse?: boolean;
  readonly label: string;
}

const COLLAPSE_SLACK = 72;

export function Splitter({
  orientation,
  value,
  min,
  max,
  defaultValue,
  onChange,
  onCollapse,
  reverse = false,
  label,
}: SplitterProps) {
  const drag = useRef<{ readonly start: number; readonly base: number } | null>(null);
  const lastRaw = useRef(value);
  const [active, setActive] = useState(false);
  const sign = reverse ? -1 : 1;
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const coordinate = (event: PointerEvent<HTMLDivElement>) =>
    orientation === "vertical" ? event.clientX : event.clientY;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { start: coordinate(event), base: value };
    lastRaw.current = value;
    setActive(true);
    document.documentElement.dataset.resizing = orientation;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) {
      return;
    }
    const raw = state.base + (coordinate(event) - state.start) * sign;
    lastRaw.current = raw;
    onChange(clamp(raw));
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) {
      return;
    }
    drag.current = null;
    setActive(false);
    document.documentElement.removeAttribute("data-resizing");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (onCollapse && lastRaw.current < min - COLLAPSE_SLACK) {
      onCollapse();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 64 : 16;
    const decrease = orientation === "vertical" ? "ArrowLeft" : "ArrowUp";
    const increase = orientation === "vertical" ? "ArrowRight" : "ArrowDown";
    if (event.key === decrease || event.key === increase) {
      event.preventDefault();
      const delta = (event.key === increase ? step : -step) * sign;
      onChange(clamp(value + delta));
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(min);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(max);
    } else if (event.key === "Enter") {
      event.preventDefault();
      onChange(defaultValue);
    }
  };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      className="cd-splitter"
      data-orientation={orientation}
      data-active={active || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={() => onChange(defaultValue)}
      onKeyDown={onKeyDown}
    />
  );
}