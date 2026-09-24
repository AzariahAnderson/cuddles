import { create } from "zustand";

export interface RecentProject {
  readonly path: string;
  readonly name: string;
  readonly openedAt: string;
}

export interface WorkspaceState {
  /** Absolute path of the open project, or null. Populated by the native workspace service later. */
  readonly root: string | null;
  readonly recent: readonly RecentProject[];
}

export const useWorkspaceStore = create<WorkspaceState>()(() => ({
  root: null,
  recent: [],
}));