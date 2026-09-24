import { EmptyState, FileCode } from "@cuddles/design-system";

export function EditorPage() {
  return (
    <div className="cd-page">
      <div className="cd-tabstrip" role="tablist" aria-label="Open files">
        <span className="cd-tabstrip-empty">No open files</span>
      </div>
      <EmptyState
        icon={FileCode}
        title="Select a file"
        description="Files you open from the explorer appear here. The editor is built on Monaco and loads on demand."
      />
    </div>
  );
}