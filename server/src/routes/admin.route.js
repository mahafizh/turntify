import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { clerkClient, getAuth, requireAuth } from "@clerk/express";
import { errorResponse, successResponse } from "../utils/response.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.get("/", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const currentUser = await clerkClient.users.getUser(userId);
  const isAdmin =
    process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
  if (!isAdmin) return errorResponse(res, 200);
  if (isAdmin) return successResponse(res, 200);
});

export default router;
