import { axiosInstance } from "@/lib/axios";
import type { Friend } from "@/types";
import { create } from "zustand";

interface ChatStore {
  // users: User[];
  friends: Friend[];
  fetchFriend: () => Promise<void>;
  // fetchUser: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
  // users: [],
  friends: [],
  error: null,
  isLoading: false,

  // fetchUser: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axiosInstance.get("/users");
  //     set({ users: response.data.data });
  //   } catch (error: any) {
  //     set({ error: error.response.data.message });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

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
