import { axiosInstance } from "@/lib/axios";
import type {
  Song,
  Collection,
  CurrentCollection,
  Stats,
  Album,
  User,
} from "@/types";
import { create } from "zustand";

interface MusicStore {
  isLoading: boolean;
  error: string | null;
  collections: Collection[];
  currentCollection: CurrentCollection | null;
  likedSongs: Song[];
  isLikedSong: Record<string, boolean>;
  stats: Stats | null;
  searchResult: { songs: Song[]; albums: Album[]; users: User[] };

  globalSearch: (keyword: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchCollections: (
    type?: "album" | "playlist",
    visibility?: "private" | "public",
  ) => Promise<void>;
  fetchCollectionById: (id: string) => Promise<void>;
  fetchCheckLikedSong: (id: string) => Promise<void>;
  AddLikedSong: (id: string) => Promise<void>;
  RemoveLikedSong: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  collections: [],
  genres: [],
  isLoading: false,
  error: null,
  currentPlaylist: null,
  currentCollection: null,
  likedSongs: [],
  isLikedSong: {},
  stats: null,
  searchResult: { songs: [], albums: [], users: [] },

  globalSearch: async (keyword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/search?keyword=${keyword}`);
      set({ searchResult: response.data.data });
    } catch (error: any) {
      const errMsg = error.response.data.message;
      throw new Error(errMsg);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCollections: async (
    type?: "album" | "playlist",
    visibility?: "private" | "public",
  ) => {
    set({ isLoading: true, error: null, collections: [] });
    try {
      let url = "/users/collections";
      if (type && visibility) {
        url = `/users/collections?type=${type}&visibility=${visibility}`;
      } else if (type) {
        url = `/users/collections?type=${type}`;
      } else if (visibility) {
        url = `/users/collections?visibility=${visibility}`;
      }
      const response = await axiosInstance.get(url);
      set({ collections: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCollectionById: async (id) => {
    set({ isLoading: true, error: null, currentCollection: null });
    try {
      const response = await axiosInstance.get(`/users/collections/${id}`);
      set({ currentCollection: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCheckLikedSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`users/songs/${id}`);
      set((state) => ({
        isLikedSong: {
          ...state.isLikedSong,
          [id]: response.data.data.exists,
        },
      }));
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  AddLikedSong: async (id) => {
    set({ isLoading: true, error: null });
    set((state) => ({
      isLikedSong: {
        ...state.isLikedSong,
        [id]: true,
      },
    }));
    try {
      await axiosInstance.post(`users/songs/${id}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  RemoveLikedSong: async (id) => {
    set({ isLoading: true, error: null });
    set((state) => ({
      isLikedSong: {
        ...state.isLikedSong,
        [id]: false,
      },
    }));
    try {
      await axiosInstance.patch(`users/songs/${id}`);
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
