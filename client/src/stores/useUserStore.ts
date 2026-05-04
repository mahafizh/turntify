import { axiosInstance } from "@/lib/axios";
import type { User } from "@/types";
import { create } from "zustand";

interface UserStore {
  error: string | null;
  isLoading: boolean;
  user: User | null;

  fetchUser: () => Promise<void>;
  updateUser: (
    userId: string,
    data: {
      name?: string;
      imageFile?: File;
    },
  ) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  error: null,
  isLoading: false,
  user: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance("/auth/me");
      set({ user: response.data.data });
    } catch (error: any) {
      set({ error: error.response.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (userId, data) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      if (data.name) formData.append("fullName", data.name);
      if (data.imageFile) formData.append("imageFile", data.imageFile);

      await axiosInstance.patch(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      const errMsg = error.response.data.message;
      throw new Error(errMsg);
    } finally {
      set({ isLoading: false });
    }
  },
}));
