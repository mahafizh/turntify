import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

let ioInstance = null;

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance = io;

  const userSockets = new Map();
  const userActivities = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSockets.set(userId, socket.id);

    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "online");
      io.emit("user_connected", userId);
      socket.emit("user_online", Array.from(userSockets.keys()));
      io.emit("activites", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", (data) => {
      console.log("Activity updated for sidebar:", data.userId);
      userActivities.set(data.userId, data.isPlaying ? "listening" : "online");
      io.emit("activity_update", data);
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const message = await Message.create({ senderId, receiverId, content });
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }
        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message Error: ", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUser;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUser = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUser) io.emit("user_disconnected", disconnectedUser);
    });
  });

  return io;
};

export const getIO = () => {
  return ioInstance;
};