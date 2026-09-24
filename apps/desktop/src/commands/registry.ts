import type { LucideIcon } from "@cuddles/design-system";
import { useSyncExternalStore } from "react";
import { log } from "../lib/log";

export interface Command {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  /** Canonical combo, e.g. "Mod+Shift+F". Order: Mod, Alt, Shift, Key. */
  readonly shortcut?: string;
  readonly icon?: LucideIcon;
  readonly group: string;
  readonly enabled?: () => boolean;
  readonly execute: () => void | Promise<void>;
}

function isSubsequence(needle: string, haystack: string): boolean {
  let index = 0;
  for (const char of haystack) {
    if (char === needle[index]) {
      index += 1;
    }
    if (index === needle.length) {
      return true;
    }
  }
  return false;
}

function scoreCommand(command: Command, query: string): number {
  const title = command.title.toLowerCase();
  if (title.startsWith(query)) {
    return 100;
  }
  const at = title.indexOf(query);
  if (at >= 0) {
    return 80 - Math.min(at, 40);
  }
  const extra = [command.group, ...(command.keywords ?? [])].join(" ").toLowerCase();
  if (extra.includes(query)) {
    return 40;
  }
  return isSubsequence(query, title) ? 20 : 0;
}

export function searchCommands(commands: readonly Command[], query: string): readonly Command[] {
  const available = commands.filter((command) => command.enabled?.() ?? true);
  const q = query.trim().toLowerCase();
  if (q === "") {
    return available;
  }
  return available
    .map((command) => ({ command, score: scoreCommand(command, q) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.command);
}

type Listener = () => void;

class CommandRegistry {
  private readonly commands = new Map<string, Command>();
  private readonly listeners = new Set<Listener>();
  private snapshot: readonly Command[] = [];

  readonly register = (command: Command): (() => void) => {
    this.commands.set(command.id, command);
    this.publish();
    return () => this.unregister(command.id);
  };

  readonly unregister = (id: string): void => {
    if (this.commands.delete(id)) {
      this.publish();
    }
  };

  readonly list = (): readonly Command[] => this.snapshot;

  readonly search = (query: string): readonly Command[] => searchCommands(this.snapshot, query);

  readonly byShortcut = (combo: string): Command | undefined =>
    this.snapshot.find((command) => command.shortcut === combo);

  readonly execute = async (id: string): Promise<void> => {
    const command = this.commands.get(id);
    if (!command || (command.enabled && !command.enabled())) {
      return;
    }
    try {
      await command.execute();
    } catch (error: unknown) {
      log.error("commands", `command failed: ${id}`, {
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  };

  readonly subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private publish(): void {
    this.snapshot = Array.from(this.commands.values());
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const commandRegistry = new CommandRegistry();

export function useCommands(): readonly Command[] {
  return useSyncExternalStore(commandRegistry.subscribe, commandRegistry.list);
}