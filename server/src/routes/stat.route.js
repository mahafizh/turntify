import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { authUser, requireAdmin } from "../middleware/auth.middleware.js";
import { getStatistic } from "../controller/stat.controller.js";

const router = Router();

router.get("/", requireAuth(), authUser, getStatistic);

export default router;
