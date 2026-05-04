import { axiosInstance } from "@/lib/axios";
import type { Genre } from "@/types";
import { create } from "zustand";

interface GenreStore {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;

  fetchGenres: () => Promise<void>;
}

export const useGenreStore = create<GenreStore>((set) => ({
  genres: [],
  isLoading: false,
  error: null,

  fetchGenres: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/genres");
      set({ genres: response.data.data });
    } catch (error: any) {
      set({ error: error.response.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
