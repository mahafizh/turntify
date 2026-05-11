import { io, Socket } from "socket.io-client";

// Gunakan variable environment untuk URL Backend kamu
const SOCKET_URL = import.meta.env.VITE_API_URL;

let socket: Socket | null = null;

export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
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

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
