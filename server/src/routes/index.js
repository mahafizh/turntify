import { Router } from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import adminRoutes from "./admin.route.js";
import songRoutes from "./song.route.js";
import albumRoutes from "./album.route.js";
import playlistRoutes from "./playlist.route.js";
import genreRoutes from "./genre.route.js";
import statRoutes from "./stat.route.js";
import searchRoutes from "./search.route.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("API is Running");
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/songs", songRoutes);
router.use("/albums", albumRoutes);
router.use("/playlists", playlistRoutes);
router.use("/genres", genreRoutes);
router.use("/stats", statRoutes);
router.use("/search", searchRoutes);

export default router;
