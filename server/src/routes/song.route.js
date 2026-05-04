import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createSong,
  deleteSong,
  getAllSong,
  getSongById,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
  updateSong,
  addSongToAlbum,
  removeSongFromAlbum,
  addSongToPlaylist,
  removeSongFromPlaylist,
  addSongPlayed,
} from "../controller/song.controller.js";

const router = Router();

router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.patch("/played/:songId", addSongPlayed);

router.use(requireAuth(), authUser);

router.patch("/:songId/albums/:albumId", addSongToAlbum);
router.delete("/:songId/albums/:albumId", removeSongFromAlbum);

router.patch("/:songId/playlists/:playlistId", addSongToPlaylist);
router.delete("/:songId/playlists/:playlistId", removeSongFromPlaylist);

router.get("/", getAllSong);
router.get("/:id", getSongById);
router.post("/", createSong);
router.patch("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;
