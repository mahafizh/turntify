import type { Message } from "@/types";
import { io } from "socket.io-client";
import { create } from "zustand";
import { useUserStore } from "./useUserStore";

interface SocketStore {
  error: string | null;
  isLoading: boolean;

  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;

  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

const SOCKET_URL = import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:5000" : "/";
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useSocketStore = create<SocketStore>((set, get) => ({
  error: null,
  isLoading: false,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),

  initSocket: (userId: string) => {
    console.log(userId)
    if (!get().isConnected) {
      socket.io.opts.query = { userId };
      socket.auth = { userId };
      socket.connect();

      socket.emit("user_connected", userId);

      socket.on("user_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: Message) => {
        const currentMessage = useUserStore.getState().message;
        useUserStore.setState({
          message: [...currentMessage, message],
        });
      });

      socket.on("message_sent", (message: Message) => {
        const currentMessage = useUserStore.getState().message;
        useUserStore.setState({
          message: [...currentMessage, message],
        });
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });

        set({ isConnected: true });
      });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
}));
