import { axiosInstance } from "@/lib/axios";
import type {
  Genre,
  Song,
  Collection,
  Album,
  Playlist,
  CurrentCollection,
} from "@/types";
import { create } from "zustand";

interface MusicStore {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
  currentAlbum: Album | null;
  currentPlaylist: Playlist | null;
  featured: Song[];
  madeForYou: Song[];
  trending: Song[];
  collections: Collection[];
  currentCollection: CurrentCollection | null;

  // fetchAlbums: () => Promise<void>;
  fetchCollections: (type?: "album" | "playlist") => Promise<void>;
  fetchTrending: () => Promise<void>;
  fetchFeatured: () => Promise<void>;
  fetchMadeForYou: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchPlaylistsById: (id: string) => Promise<void>;
  fetchCollectionById: (id: string) => Promise<void>;
  fetchGenres: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  playlists: [],
  collections: [],
  genres: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  currentPlaylist: null,
  featured: [],
  trending: [],
  madeForYou: [],
  currentCollection: null,

  fetchGenres: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance("/genres");
      set({ genres: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCollections: async (type?: "album" | "playlist") => {
    set({ isLoading: true, error: null });
    try {
      const url = type
        ? `/users/collections?type=${type}`
        : "/users/collections";
      const response = await axiosInstance.get(url);
      set({ collections: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistsById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      set({ currentPlaylist: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCollectionById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/collections/${id}`);
      set({ currentCollection: response.data.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // fetchAlbums: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axiosInstance.get("collections/albums");
  //     set({ albums: response.data.data });
  //   } catch (error: any) {
  //     set({ error: error.response.data.message });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

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
