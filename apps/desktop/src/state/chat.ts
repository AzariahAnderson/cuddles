import { create } from "zustand";

export interface ChatState {
  readonly draft: string;
  readonly setDraft: (draft: string) => void;
  readonly resetConversation: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  draft: "",
  setDraft: (draft) => set({ draft }),
  resetConversation: () => set({ draft: "" }),
}));