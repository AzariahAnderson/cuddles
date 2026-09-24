import type { LucideIcon } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";
import { Search } from "../icons";
import { Icon } from "../primitives/Icon";

export interface SearchFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly label: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
}: SearchFieldProps) {
  return (
    <label className="cd-field" data-disabled={disabled || undefined}>
      <Icon icon={Search} size={14} />
      <input
        className="cd-field-input"
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export interface SegmentedOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly icon?: LucideIcon;
}

export interface SegmentedControlProps<T extends string> {
  readonly label: string;
  readonly value: T;
  readonly options: readonly SegmentedOption<T>[];
  readonly onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  const group = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (direction === 0) {
      return;
    }
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const nextIndex = (index + direction + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) {
      return;
    }
    onChange(next.value);
    group.current?.querySelectorAll<HTMLElement>('[role="radio"]')[nextIndex]?.focus();
  };

  return (
    <div ref={group} role="radiogroup" aria-label={label} className="cd-seg" onKeyDown={onKeyDown}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value ? 0 : -1}
          className="cd-seg-item"
          onClick={() => onChange(option.value)}
        >
          {option.icon ? <Icon icon={option.icon} size={14} /> : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}