import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  addCollaboratorToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylistById,
  removeCollaboratorFromPlaylist,
  updatePlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

router.use(requireAuth(), authUser);
router.get("/", getPlaylist);
router.post("/", createPlaylist);
router.patch("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);
router.get("/:id", getPlaylistById);

router.patch("/:playlistId/users/:collaboratorId", addCollaboratorToPlaylist);
router.delete("/:playlistId/users/:collaboratorId", removeCollaboratorFromPlaylist);

export default router;
