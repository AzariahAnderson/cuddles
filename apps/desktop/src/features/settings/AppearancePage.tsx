import {
  Monitor,
  Moon,
  prefersReducedMotion,
  SegmentedControl,
  Sun,
  Text,
  type ThemePreference,
} from "@cuddles/design-system";
import { Page, Section } from "../../shell/Page";
import { useUiStore } from "../../state/ui";

const OPTIONS = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearancePage() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  return (
    <Page title="Appearance">
      <Section title="Theme">
        <SegmentedControl<ThemePreference>
          label="Theme"
          value={theme}
          options={OPTIONS}
          onChange={setTheme}
        />
        <Text as="p" variant="secondary">
          Dark is the primary theme. Light uses a warm cream surface with the same orange accent.
        </Text>
      </Section>
      <Section title="Motion">
        <Text as="p" variant="secondary">
          Animations follow your system reduced-motion setting. It is currently{" "}
          {prefersReducedMotion() ? "on, so animations are disabled." : "off, so animations play."}
        </Text>
      </Section>
    </Page>
  );
}