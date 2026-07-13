import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:5000" : "/";
let socket: Socket | null = null;

export const getSocket = (userId?: string) => {
  if (!socket && userId) {
    console.log("Initializing socket connection for user:", userId);
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      query: { userId },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.io server with ID:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};