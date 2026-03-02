import dotenv from "dotenv";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { Album } from "../models/album.model.js";
import { successResponse } from "../utils/response.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";
import { AppError } from "../utils/ErrorHandler.js";
import { User } from "../models/user.model.js";
dotenv.config();

export const getAlbum = async (req, res, next) => {
  try {
    const album = await Album.find();
    // if (album.length === 0) success("Album is empty", 200);
    return successResponse(res, 200, album);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);
    // if (!album) throw new AppError("Album not found", 404);
    const songs = await Song.find({ album: id }).select(
      "title duration performer played",
    );
    let totalDuration = 0;
    songs.map((s) => {
      totalDuration += s.duration;
    });
    return successResponse(res, 200, {
      ...album.toObject(),
      songs,
      duration: totalDuration,
    });
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  const { title, type } = req.body;
  const userId = req.user._id;
  let imageUrl = process.env.DEFAULT_IMAGE;
  try {
    if (req.files?.imageFile)
      imageUrl = await uploadToCloudinary(req.files.imageFile);

    const album = new Album({
      title,
      type,
      createdBy: userId,
      imageUrl,
    });
    await album.save();
    return successResponse(res, 201, album);
  } catch (error) {
    if (imageUrl !== process.env.DEFAULT_IMAGE)
      await deleteFromCloudinary(imageUrl);
    next(error);
  }
};

export const updateAlbum = async (req, res, next) => {
  const { id } = req.params;
  const { title, visibility, type } = req.body || {};
  const userId = req.user._id;
  let newImageUrl;
  let oldImageUrl;
  try {
    if (!req.body) throw new AppError("You are not changing anything", 200);
    const album = await Album.findOne({ _id: id, createdBy: userId });
    // if (!album) throw new AppError("Album not found", 404);

    if (title !== undefined) album.title = title;
    if (visibility !== undefined) album.visibility = visibility;
    if (type !== undefined) album.type = type;

    if (req.files?.imageFile) {
      oldImageUrl = album.imageUrl;
      newImageUrl = await uploadToCloudinary(req.files.imageFile);
      album.imageUrl = newImageUrl;
    }
    const updatedAlbum = await album.save();
    if (oldImageUrl) await deleteFromCloudinary(oldImageUrl);
    return successResponse(res, 200, updatedAlbum);
  } catch (error) {
    if (newImageUrl) await deleteFromCloudinary(newImageUrl);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const album = await Album.findOneAndDelete(
      { _id: id, createdBy: userId },
      {
        session,
      },
    );
    // if (!album) throw new AppError("Album not found", 404);

    await Song.find({ album: id });

    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedAlbums: id } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    if (album.imageUrl !== process.env.DEFAULT_IMAGE)
      await deleteFromCloudinary(album.imageUrl);
    return successResponse(res, 200);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
