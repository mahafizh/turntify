import { axiosInstance } from "@/lib/axios";
import type { Song } from "@/types";
import { create } from "zustand";

interface SongStore {
  isLoading: boolean;
  error: string | null;

  songs: Song[];
  featured: Song[];
  madeForYou: Song[];
  trending: Song[];

  createSong: (
    title: string,
    performer: string,
    writer: string,
    publisher: string,
    duration: number,
    releaseYear: number,
    genres: string[],
    audioFile: File,
  ) => Promise<void>;

  updateSong: (
    id: string,
    title: string,
    performer: string,
    writer: string,
    publisher: string,
    duration: number,
    releaseYear: number,
    genres: string[],
    audioFile: File,
  ) => Promise<void>;
  fetchSongs: (userId?: string) => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchTrending: () => Promise<void>;
  fetchMadeForYou: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  addSongToAlbum: (songId: string, albumId: string) => Promise<void>;
  removeSongFromAlbum: (songId: string, albumId: string) => Promise<void>;
}

export const useSongStore = create<SongStore>((set) => ({
  songs: [],
  featured: [],
  trending: [],
  madeForYou: [],
  isLoading: false,
  error: null,

  createSong: async (
    title,
    performer,
    writer,
    publisher,
    duration,
    releaseYear,
    genres,
    audioFile,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("performer", performer);
      formData.append("writer", writer);
      formData.append("publisher", publisher);
      formData.append("duration", duration.toString());
      formData.append("releaseYear", releaseYear.toString());
      if (audioFile) formData.append("audioFile", audioFile);
      if (genres && genres.length > 0) {
        genres.forEach((id) => {
          formData.append("genres", id);
        });
      }

      await axiosInstance.post(`/songs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      const errMsg = error.response.data?.message;
      throw new Error(errMsg);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSong: async (
    id,
    title,
    performer,
    writer,
    publisher,
    duration,
    releaseYear,
    genres,
    audioFile,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("performer", performer);
      formData.append("writer", writer);
      formData.append("publisher", publisher);
      formData.append("duration", duration.toString());
      formData.append("releaseYear", releaseYear.toString());
      if (audioFile) formData.append("audioFile", audioFile);
      if (genres && genres.length > 0) {
        genres.forEach((id) => {
          formData.append("genres", id);
        });
      }

      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });

      await axiosInstance.patch(`/songs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      const errMsg = error.response.data?.message;
      throw new Error(errMsg);
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToAlbum: async (songId, albumId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.patch(`/songs/${songId}/albums/${albumId}`);
    } catch (error: any) {
      set({ error: error.response.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongFromAlbum: async (songId, albumId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/songs/${songId}/albums/${albumId}`);
    } catch (error: any) {
      set({ error: error.response.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (songId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/songs/${songId}`);
    } catch (error: any) {
      set({ error: error.response.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async (userId?) => {
    set({ isLoading: true, error: null });
    try {
      const url = userId ? `/songs?userId=${userId}` : "/songs";
      const response = await axiosInstance.get(url);
      set({ songs: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFeatured: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featured: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrending: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trending: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYou: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYou: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
