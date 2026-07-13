import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbumById,
  getMadeForYouAlbums,
  updateAlbum,
} from "../controller/album.controller.js";

const router = Router();

router.get("/made-for-you", getMadeForYouAlbums);
router.use(requireAuth(), authUser);
router.get("/", getAlbum);
router.post("/", createAlbum);
router.patch("/:id", updateAlbum);
router.delete("/:id", deleteAlbum);
router.get("/:id", getAlbumById);
export default router;
