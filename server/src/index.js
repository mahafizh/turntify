import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import fs from "fs";
import cron from "node-cron";

import routes from "./routes/index.js";
import { connectDB } from "./lib/database.js";
import { initializeSocket } from "./utils/Socket.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:5173", process.env.CLIENT_URL],
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

const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

const httpServer = createServer(app);
const io = initializeSocket(httpServer);
app.set("io", io);

app.use("/api", routes);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
