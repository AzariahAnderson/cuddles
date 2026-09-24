import { Kbd } from "@cuddles/design-system";
import { formatShortcut } from "../commands/shortcuts";

export function Keys({ combo }: { readonly combo: string }) {
  return (
    <span className="cd-keys">
      {formatShortcut(combo).map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </span>
  );
}