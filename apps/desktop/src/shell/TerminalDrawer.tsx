import { IconButton, PanelHeader, X } from "@cuddles/design-system";
import { TerminalEmpty } from "../features/terminal/TerminalEmpty";
import { useUiStore } from "../state/ui";

export function TerminalDrawer() {
  const setTerminalOpen = useUiStore((s) => s.setTerminalOpen);
  return (
    <>
      <PanelHeader
        title="Terminal"
        actions={
          <IconButton
            icon={X}
            label="Close terminal drawer"
            size="sm"
            onClick={() => setTerminalOpen(false)}
          />
        }
      />
      <div className="cd-panelbody">
        <TerminalEmpty />
      </div>
    </>
  );
}