import { Bot, EmptyState, IconButton, PanelHeader, X } from "@cuddles/design-system";
import { useUiStore } from "../state/ui";

export function UtilityPanel() {
  const setUtilityOpen = useUiStore((s) => s.setUtilityOpen);
  return (
    <>
      <PanelHeader
        title="Agent activity"
        actions={
          <IconButton
            icon={X}
            label="Close utility panel"
            size="sm"
            onClick={() => setUtilityOpen(false)}
          />
        }
      />
      <div className="cd-panelbody">
        <EmptyState
          icon={Bot}
          title="No agent activity"
          description="Plans, tool calls, permission requests and proposed diffs will appear here. The agent is not built yet."
        />
      </div>
    </>
  );
}