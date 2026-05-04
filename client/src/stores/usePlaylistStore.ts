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
  DeletePlaylist: (playlistId: string) => Promise<void>;
  UpdatePlaylist: (
    type: "update" | "visibility",
    playlistId: string,
    data: {
      imageFile?: File;
      title?: string;
      description?: string;
      visibility?: string;
    },
  ) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  isLoading: false,
  error: null,
  playlists: [],

  UpdatePlaylist: async (type, playlistId, data) => {
    set({ isLoading: true, error: null });
    try {
      let payload;
      let headers = {};
      if (type === "update") {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.imageFile) formData.append("imageFile", data.imageFile);

        payload = formData;
        headers = {
          "Content-Type": "multipart/form-data",
        };
      } else {
        payload = {
          visibility: data.visibility,
        };
        headers = { "Content-Type": "application/json" };
      }
      await axiosInstance.patch(`/playlists/${playlistId}`, payload, {
        headers,
      });
    } catch (error: any) {
      const errMsg = error.response.data.message;
      throw new Error(errMsg);
    } finally {
      set({ isLoading: false });
    }
  },

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
      await axiosInstance.patch(`/songs/${songId}/playlists/${playlistId}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  RemoveSongFromPlaylist: async (songId, playlistId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/songs/${songId}/playlists/${playlistId}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  DeletePlaylist: async (playlistId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
