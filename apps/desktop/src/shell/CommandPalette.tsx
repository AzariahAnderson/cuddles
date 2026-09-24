import { Dialog, Icon, Search } from "@cuddles/design-system";
import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { type Command, commandRegistry, searchCommands, useCommands } from "../commands/registry";
import { useUiStore } from "../state/ui";
import { Keys } from "./Shortcut";

function PaletteBody({ onDone }: { readonly onDone: () => void }) {
  const commands = useCommands();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => searchCommands(commands, query), [commands, query]);
  const selected = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current
      ?.querySelectorAll<HTMLElement>('[role="option"]')
      [selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const run = (command: Command | undefined) => {
    if (!command) {
      return;
    }
    onDone();
    void commandRegistry.execute(command.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setActive((selected + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setActive((selected - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[selected]);
    }
  };

  return (
    <>
      <div className="cd-palette-input-row">
        <Icon icon={Search} size={16} />
        <input
          data-autofocus
          className="cd-palette-input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[selected] ? `${listId}-${selected}` : undefined}
          aria-label="Search commands"
          placeholder="Type a command or search\u2026"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className="cd-palette-list">
        {results.length === 0 ? (
          <div className="cd-palette-empty">No matching commands</div>
        ) : (
          results.map((command, index) => (
            <button
              key={command.id}
              id={`${listId}-${index}`}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={index === selected}
              className="cd-palette-item"
              onPointerMove={() => setActive(index)}
              onClick={() => run(command)}
            >
              <span className="cd-palette-icon">
                {command.icon ? <Icon icon={command.icon} size={16} /> : null}
              </span>
              <span className="cd-palette-title">{command.title}</span>
              <span className="cd-palette-group">{command.group}</span>
              {command.shortcut ? <Keys combo={command.shortcut} /> : null}
            </button>
          ))
        )}
      </div>
      <div className="cd-palette-foot" aria-hidden="true">
        <span>{"\u2191\u2193 navigate"}</span>
        <span>{"\u21B5 run"}</span>
        <span>esc close</span>
      </div>
    </>
  );
}

export function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen);
  const setOpen = useUiStore((s) => s.setPaletteOpen);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} title="Command palette" variant="palette" width={640}>
      <PaletteBody onDone={() => setOpen(false)} />
    </Dialog>
  );
}