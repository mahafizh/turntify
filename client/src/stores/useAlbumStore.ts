import { axiosInstance } from "@/lib/axios";
import type { Album } from "@/types";
import { create } from "zustand";

interface AlbumStore {
  isLoading: boolean;
  error: string | null;
  albums: Album[];
  madeForYou: Album[];

  fetchMadeForYou: () => Promise<void>;
  createAlbum: (title: string, type: string, imageFile: File) => Promise<void>;
  updateAlbum: (
    id: string,
    title: string,
    type: string,
    visibility: string,
    imageFile: File,
  ) => Promise<void>;
  fetchAlbum: (userId?: string) => Promise<void>;
  deleteAlbum: (albumId: string) => Promise<void>;
}

export const useAlbumStore = create<AlbumStore>((set) => ({
  isLoading: false,
  error: null,
  albums: [],
  madeForYou: [],

  fetchMadeForYou: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums/made-for-you");
      set({ madeForYou: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbum: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = userId ? `/albums?userId=${userId}` : "/albums";
      const response = await axiosInstance.get(url);
      set({ albums: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createAlbum: async (title, type, imageFile) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      if (imageFile) formData.append("imageFile", imageFile);

      await axiosInstance.post("/albums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAlbum: async (id, title, type, visibility, imageFile) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("visibility", visibility);
      if (imageFile) formData.append("imageFile", imageFile);

      await axiosInstance.patch(`/albums/${id}`, formData, {
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

  deleteAlbum: async (albumId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/albums/${albumId}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
