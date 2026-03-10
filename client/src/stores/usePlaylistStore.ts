import { axiosInstance } from "@/lib/axios";
import type { Playlist } from "@/types";
import { create } from "zustand";

interface PlaylistStore {
  isLoading: boolean;
  error: string | null;
  playlists: Playlist[]

  fetchCreatePlaylist: () => Promise<void>;
  fetchPlaylist: () => Promise<void>
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  isLoading: false,
  error: null,
  playlists: [],

  fetchPlaylist: async() => {
    set({isLoading: true, error: null})
    try {
      const response = await axiosInstance.get("/playlists")
      set({playlists: response.data.data})
    } catch (error:any) {
      set({error: error.response.data.message})
    } finally {
      set({isLoading: false})
    }
  },

  fetchCreatePlaylist: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/playlists");
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
