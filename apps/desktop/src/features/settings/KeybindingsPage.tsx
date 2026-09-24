import { Text } from "@cuddles/design-system";
import { useCommands } from "../../commands/registry";
import { Page, Section } from "../../shell/Page";
import { Keys } from "../../shell/Shortcut";

export function KeybindingsPage() {
  const commands = useCommands();
  return (
    <Page title="Keyboard shortcuts">
      <Section title="Commands">
        <div className="cd-list">
          {commands.map((command) => (
            <div key={command.id} className="cd-row cd-row-tight">
              <div className="cd-row-main">
                <Text variant="body">{command.title}</Text>
                <Text variant="caption">{command.group}</Text>
              </div>
              {command.shortcut ? (
                <Keys combo={command.shortcut} />
              ) : (
                <Text variant="caption">Unbound</Text>
              )}
            </div>
          ))}
        </div>
        <Text as="p" variant="secondary">
          Every command is registered in the command registry. Custom keybindings are planned.
        </Text>
      </Section>
    </Page>
  );
}