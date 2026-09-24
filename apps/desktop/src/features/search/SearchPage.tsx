import { EmptyState, Search, SearchField } from "@cuddles/design-system";
import { useState } from "react";
import { Page } from "../../shell/Page";

export function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    <Page title="Search">
      <SearchField
        label="Search in workspace"
        placeholder="Open a project to search"
        value={query}
        onChange={setQuery}
        disabled
      />
      <EmptyState
        compact
        icon={Search}
        title="Nothing to search yet"
        description="Search runs in the native layer over the open workspace. Open a project first."
      />
    </Page>
  );
}