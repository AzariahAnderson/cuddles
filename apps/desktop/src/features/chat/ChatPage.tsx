import { Button, EmptyState, IconButton, PanelHeader, Sparkles, SquarePen } from "@cuddles/design-system";
import { useNavigate } from "@tanstack/react-router";
import { useChatStore } from "../../state/chat";
import { Composer } from "./Composer";

export function ChatPage() {
  const navigate = useNavigate();
  const reset = useChatStore((s) => s.resetConversation);
  return (
    <div className="cd-chat">
      <PanelHeader
        title="New conversation"
        actions={
          <IconButton icon={SquarePen} label="New conversation" size="sm" onClick={reset} />
        }
      />
      <div className="cd-chat-body">
        <EmptyState
          icon={Sparkles}
          title="Start a conversation"
          description="Ask about your project, request changes or plan work. Connect a provider first: bring your own key or a local model."
        >
          <Button
            variant="primary"
            onClick={() => void navigate({ to: "/settings/providers" })}
          >
            Connect a provider
          </Button>
        </EmptyState>
      </div>
      <div className="cd-chat-dock">
        <div className="cd-chat-dock-inner">
          <Composer />
        </div>
      </div>
    </div>
  );
}