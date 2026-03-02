import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser, requireAdmin } from "../middleware/auth.middleware.js";
import {
  addFriend,
  addLikedSong,
  addPlaylist,
  addSavedAlbum,
  getAllUser,
  getCollection,
  getCollectionById,
  getFriend,
  getUserById,
  removeFriend,
  removeLikedSong,
  removePlaylist,
  removeSavedAlbum,
  updateUser,
} from "../controller/user.controller.js";

const router = Router();

router.use(requireAuth(), authUser);

router.get("/friends", getFriend);
router.post("/friends/:friendId", addFriend);
router.patch("/friends/:friendId", removeFriend);

router.post("/albums/:albumId", addSavedAlbum);
router.patch("/albums/:albumId", removeSavedAlbum);

router.post("/playlists/:playlistId", addPlaylist);
router.patch("/playlists/:playlistId", removePlaylist);

router.post("/songs/:songId", addLikedSong);
router.patch("/songs/:songId", removeLikedSong);

router.get("/collections", getCollection);
router.get("/collections/:id", getCollectionById);

router.get("/", getAllUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);

export default router;
