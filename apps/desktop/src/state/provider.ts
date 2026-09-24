import { create } from "zustand";

export interface ProviderProfile {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
}

export interface ProviderState {
  /** Provider profiles (no secrets, ever). Populated by the native settings service later. */
  readonly profiles: readonly ProviderProfile[];
}

export const useProviderStore = create<ProviderState>()(() => ({
  profiles: [],
}));