import { Button, EmptyState, Plus, SquareTerminal, Tooltip } from "@cuddles/design-system";

export function TerminalEmpty() {
  return (
    <EmptyState
      icon={SquareTerminal}
      title="Open a terminal"
      description="Shell sessions (PowerShell, bash, zsh) will run in native pseudo-terminals with xterm.js. The terminal service is not built yet."
    >
      <Tooltip label="Needs the native terminal service">
        <Button variant="primary" size="sm" icon={Plus} disabled>
          New terminal
        </Button>
      </Tooltip>
    </EmptyState>
  );
}