import { create } from "zustand";
import type {Song } from "@/types";

interface playerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initQueue: (songs: Song[]) => void;
  playCollection: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<playerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initQueue: (songs) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playCollection: (songs, startIndex = 0) => {
    if (songs.length === 0) return;
    const song = songs[startIndex];
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const startPlaying = !get().isPlaying;
    set({
      isPlaying: startPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
    }
  },

}));