import dotenv from "dotenv";
import mongoose from "mongoose";
import { successResponse } from "../utils/response.js";
import { Playlist } from "../models/playlist.model.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/ErrorHandler.js";

export const getPlaylist = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const playlist = await Playlist.find({
      $or: [{ createdBy: userId }, { collaborators: userId }],
    });
    return successResponse(res, 200, playlist);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const playlistExist = await Playlist.exists({ _id: id });
    // if (!playlistExist) throw new AppError("Playlist not found", 404);
    const playlist = await Playlist.findById(id)
      .populate({
        path: "songs",
        populate: {
          path: "song",
          select: "title duration performer played",
        },
      })
      .populate({ path: "createdBy", select: "fullName" })
      .populate({ path: "collaborators", select: "fullName" });
    let totalDuration = 0;
    playlist.songs.map((s) => {
      totalDuration += s.song.duration;
    });
    return successResponse(res, 200, {
      ...playlist.toObject(),
      duration: totalDuration,
    });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const userId = req.user._id;
  const imageUrl = process.env.DEFAULT_IMAGE;

  try {
    const totalPlaylist = await Playlist.countDocuments({ createdBy: userId });
    const playlist = new Playlist({
      title: `My Playlist ${totalPlaylist + 1}`,
      imageUrl,
      createdBy: userId,
    });

    const createdPlaylist = await playlist.save({ session });

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { playlists: createdPlaylist._id },
      },
      { session },
    );
    await session.commitTransaction();
    session.endSession();
    return successResponse(res, 201, createdPlaylist);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (imageUrl && imageUrl !== process.env.DEFAULT_IMAGE)
      await deleteFromCloudinary(imageUrl);
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  const { id } = req.params;
  const { title, visibility, description } = req.body || {};
  const userId = req.user._id;
  let newImageUrl;
  let oldImageUrl;

  try {
    const playlist = await Playlist.findOne({ _id: id, createdBy: userId });

    if (title !== undefined) playlist.title = title;
    if (visibility !== undefined) playlist.visibility = visibility;
    if (description !== undefined) playlist.description = description;

    if (req.files?.imageFile) {
      oldImageUrl = playlist.imageUrl;
      newImageUrl = await uploadToCloudinary(req.files.imageFile);
      playlist.imageUrl = newImageUrl;
    }
    const updatedPlaylist = await playlist.save();
    if (updatedPlaylist) {
      if (oldImageUrl && oldImageUrl !== process.env.DEFAULT_IMAGE)
        await deleteFromCloudinary(oldImageUrl);
      return successResponse(res, 200, updatedPlaylist);
    }
  } catch (error) {
    if (newImageUrl) await deleteFromCloudinary(newImageUrl);
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const playlist = await Playlist.findOneAndDelete(
      { _id: id, createdBy: userId },
      { session },
    );
    // if (!playlist) throw new AppError("Playlist not found", 404);

    await User.findByIdAndUpdate(
      userId,
      { $pull: { playlists: id } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    if (playlist.imageUrl && playlist.imageUrl !== process.env.DEFAULT_IMAGE)
      await deleteFromCloudinary(playlist.imageUrl);
    return successResponse(res, 200);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const addCollaboratorToPlaylist = async (req, res, next) => {
  const { playlistId, collaboratorId } = req.params;
  const userId = req.user._id;
  try {
    // const exist = await User.exists({ _id: collaboratorId });
    // if (!exist) throw new AppError("User not found", 404);

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        createdBy: userId,
        collaborators: { $ne: collaboratorId },
      },
      { $addToSet: { collaborators: collaboratorId } },
      { new: true },
    );
    if (!playlist) throw new AppError("User already added", 400);
    return successResponse(res, 200, playlist);
  } catch (error) {
    next(error);
  }
};

export const removeCollaboratorFromPlaylist = async (req, res, next) => {
  const { playlistId, collaboratorId } = req.params;
  const userId = req.user._id;
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, createdBy: userId, collaborators: collaboratorId },
      { $pull: { collaborators: collaboratorId } },
      { new: true },
    );
    return successResponse(res, 200, playlist);
  } catch (error) {
    next(error);
  }
};
