import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { connectDB } from "./lib/database.js";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors"; // 1. Pastikan diimport
import { errorHandler } from "./middleware/error.middleware.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:5173"],
  }),
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
);

const userSockets = new Map();
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSockets.set(userId, socket.id);
  
  socket.on("update_activity", (data) => {
    io.emit("friend_activity_update", data);
  });
  
  socket.on("disconnect", () => {
    userSockets.delete(userId);
  });
});

app.set("io", io);
app.use("/api", routes);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
