import { axiosInstance } from "@/lib/axios";
import type { Playlist } from "@/types";
import { create } from "zustand";

interface PlaylistStore {
  isLoading: boolean;
  error: string | null;
  playlists: Playlist[];

  CreatePlaylist: () => Promise<void>;
  fetchPlaylist: () => Promise<void>;
  AddSongToPlaylist: (songId: string, playlistId: string) => Promise<void>;
  RemoveSongFromPlaylist: (songId: string, playlistId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  isLoading: false,
  error: null,
  playlists: [],

  fetchPlaylist: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists");
      set({ playlists: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  CreatePlaylist: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/playlists");
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  AddSongToPlaylist: async (songId, playlistId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(`songs/${songId}/playlists/${playlistId}`)
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  RemoveSongFromPlaylist: async (songId, playlistId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`songs/${songId}/playlists/${playlistId}`)
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
