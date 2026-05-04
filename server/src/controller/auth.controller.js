import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import dotenv from "dotenv";
import { AppError } from "../utils/ErrorHandler.js";
dotenv.config();

export const authCallback = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id, firstName, lastName, email, imageUrl } = req.body;
    let user = await User.findOne({ clerkId: id }).session(session);

    if (!user) {
      user = new User({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl: imageUrl,
        email: email,
      });

      const createdUser = await user.save({ session });

      const playlist = new Playlist({
        title: "Liked Songs",
        visibility: "private",
        createdBy: createdUser._id,
        imageUrl: process.env.DEFAULT_IMAGE,
      });

      const createdPlaylist = await playlist.save({ session });
      createdUser.likedPlaylist = createdPlaylist._id;
      await createdUser.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false });
    console.error(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("-clerkId")
      .populate({ path: "friends", select: "fullName imageUrl" })
      .populate({ path: "playlists", select: "title imageUrl visibility" });
    if (!user) throw new AppError("User not found", 404);
    return successResponse(res, 200, user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
