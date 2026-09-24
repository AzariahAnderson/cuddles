import { Badge, Blocks, EmptyState, GitBranch, type LucideIcon, Play } from "@cuddles/design-system";

export interface PlannedCopy {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly text: string;
}

export const PLANNED: Record<"source-control" | "run" | "extensions", PlannedCopy> = {
  "source-control": {
    icon: GitBranch,
    title: "Source control",
    text: "Git status, diffs and commits will live here once a workspace can be opened.",
  },
  run: {
    icon: Play,
    title: "Run and debug",
    text: "Build, run and game-engine tasks will appear here once a project is detected.",
  },
  extensions: {
    icon: Blocks,
    title: "Extensions",
    text: "The architecture has extension points for providers, tools, themes and engines. There is no manager yet.",
  },
};

export function PlannedPage({ area }: { readonly area: keyof typeof PLANNED }) {
  const copy = PLANNED[area];
  return (
    <div className="cd-page">
      <EmptyState icon={copy.icon} title={copy.title} description={copy.text}>
        <Badge>Not built yet</Badge>
      </EmptyState>
    </div>
  );
}