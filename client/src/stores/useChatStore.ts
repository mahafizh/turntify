import { axiosInstance } from "@/lib/axios";
import type { Friend } from "@/types";
import { create } from "zustand";

interface ChatStore {
  friends: Friend[];
  fetchFriend: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
  friends: [],
  error: null,
  isLoading: false,

  fetchFriend: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/friends");
      set({friends: response.data.data})
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
