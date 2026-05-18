import { axiosInstance } from "@/lib/axios";
import type { Friend } from "@/types";
import { create } from "zustand";

interface SocialStore {
  friends: Friend[];
  isLoading: boolean;
  error: string | null;

  fetchFriend: () => Promise<void>;
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  updateFriendActivity: (data: any) => void;
}

export const useSocialStore = create<SocialStore>((set) => ({
  friends: [],
  error: null,
  isLoading: false,

  fetchFriend: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users/friends");
      set({ friends: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addFriend: async (friendId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(`/users/friends/${friendId}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeFriend: async (friendId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.patch(`/users/friends/${friendId}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFriendActivity: (data) => {
    set((state) => ({
      friends: state.friends.map((friend) => {
        if (friend._id === data.userId) {
          return {
            ...friend,
            currentPlaying: {
              song: data.song,
              isPlaying: data.isPlaying,
            },
            lastPlayed: data.isPlaying
              ? friend.lastPlayed
              : [
                  { song: data.song, playedAt: new Date() },
                  ...friend.lastPlayed,
                ].slice(0, 1),
          };
        }
        return friend;
      }),
    }));
  },
}));
