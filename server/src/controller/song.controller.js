import { Song } from "../models/song.model.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { Genre } from "../models/genre.model.js";
import dotenv from "dotenv";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import { AppError } from "../utils/ErrorHandler.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
dotenv.config();

export const getAllSong = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    if (songs.length === 0) throw new AppError("Songs is empty", 200);
    return successResponse(res, 200, songs);
  } catch (error) {
    next(error);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id).populate("genre").populate("album");
    if (!song) throw new AppError("Song not found", 404);
    return successResponse(res, 200, song);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 }
      },
      {
        $lookup: {
          from: "albums",
          localField: "album",
          foreignField: "_id",
          as: "album"
        }
      },
      {
        $unwind: {
          path: "$album",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          album: { $ifNull: ["$album", null] }
        }
      }
    ]);

    return successResponse(res, 200, songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 }
      },
      {
        $lookup: {
          from: "albums",
          localField: "album",
          foreignField: "_id",
          as: "album"
        }
      },
      {
        $unwind: {
          path: "$album",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          album: { $ifNull: ["$album", null] }
        }
      }
    ]);

    return successResponse(res, 200, songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 }
      },
      {
        $lookup: {
          from: "albums",
          localField: "album",
          foreignField: "_id",
          as: "album"
        }
      },
      {
        $unwind: {
          path: "$album",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          album: { $ifNull: ["$album", null] }
        }
      }
    ]);

    return successResponse(res, 200, songs);
  } catch (error) {
    next(error);
  }
};

export const createSong = async (req, res, next) => {
  const userId = req.user._id;
  if (!req.files.audioFile) {
    throw new AppError("Please upload audio file", 400);
  }
  const { title, performer, writer, publisher, duration, releaseYear } =
    req.body;
  let { genre } = req.body;
  let audioUrl;
  try {
    if (!Array.isArray(genre)) {
      genre = [genre];
    }
    if (genre.length === 0) throw new AppError("Genre can't be empty", 400);

    const existingGenre = await Genre.find({
      _id: { $in: genre },
    });
    if (existingGenre.length !== genre.length) {
      throw new AppError("Genre not valid", 400);
    }

    audioUrl = await uploadToCloudinary(req.files.audioFile);

    const song = new Song({
      title,
      performer,
      writer,
      publisher,
      audioUrl,
      genre,
      duration,
      releaseYear,
      createdBy: userId,
      album: null,
    });
    const uploadedSong = await song.save();
    return successResponse(res, 201, uploadedSong);
  } catch (error) {
    if (audioUrl) await deleteFromCloudinary(audioUrl);
    next(error);
  }
};

export const updateSong = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  let newAudioUrl;
  let oldAudioUrl;
  const { title, performer, writer, publisher, duration, releaseYear, genre } =
    req.body || {};
  try {
    if (!req.body) throw new AppError("You are not changing anything", 200);
    const song = await Song.findOne({ _id: id, createdBy: userId });
    if (!song) throw new AppError("Song not found", 404);

    if (title !== undefined) song.title = title;
    if (performer !== undefined) song.performer = performer;
    if (writer !== undefined) song.writer = writer;
    if (publisher !== undefined) song.publisher = publisher;
    if (duration !== undefined) song.duration = duration;
    if (releaseYear !== undefined) song.releaseYear = releaseYear;
    if (genre !== undefined) song.genre = genre;

    if (req.files?.audioFile) {
      oldAudioUrl = song.audioUrl;
      newAudioUrl = await uploadToCloudinary(req.files.audioFile);
      song.audioUrl = newAudioUrl;
    }

    const updatedSong = await song.save();
    await deleteFromCloudinary(oldAudioUrl);
    return successResponse(res, 200, updatedSong);
  } catch (error) {
    await deleteFromCloudinary(newAudioUrl);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const song = await Song.findOneAndDelete(
      { _id: id, createdBy: userId },
      { session },
    );
    if (!song) throw new AppError("Song not found", 404);

    await User.findByIdAndUpdate(
      userId,
      { $pull: { likedSongs: id } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    await deleteFromCloudinary(song.audioUrl);
    return successResponse(res, 200);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const addSongToAlbum = async (req, res, next) => {
  const { albumId, songId } = req.params;
  try {
    const albumExists = await Album.exists({ _id: albumId });
    const songExists = await Song.exists({ _id: songId });
    if (!albumExists || !songExists)
      throw new AppError("Album or song not found", 404);

    const updatedSong = await Song.findOneAndUpdate(
      { _id: songId, album: null },
      { album: albumId },
      { new: true },
    );

    if (!updatedSong) {
      throw new AppError("Song already has an album", 400);
    }
    return successResponse(res, 200, updatedSong);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromAlbum = async (req, res, next) => {
  const { albumId, songId } = req.params;
  try {
    const albumExists = await Album.exists({ _id: albumId });
    const songExists = await Song.exists({ _id: songId });
    if (!albumExists || !songExists)
      throw new AppError("Album or song not found", 404);

    const updatedSong = await Song.findOneAndUpdate(
      {
        _id: songId,
        album: { $ne: null },
      },
      { album: null },
      { new: true },
    );
    if (!updatedSong) {
      throw new AppError("Song does not have an album", 400);
    }
    return successResponse(res, 200, updatedSong);
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  const { playlistId, songId } = req.params;
  const userId = req.user._id;
  try {
    const exist = await Song.exists({ _id: songId });
    if (!exist) throw new AppError("Song not found", 404);
    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        $or: [{ createdBy: userId }, { collaborators: userId }],
        "songs.song": { $ne: songId },
      },
      {
        $push: {
          songs: {
            song: songId,
            addedBy: userId,
          },
        },
      },
      {
        new: true,
      },
    ).populate({
      path: "songs",
      select: "song",
      populate: {
        path: "song",
        select: "title",
      },
    });
    if (!playlist) throw new AppError("Song already added to playlist");
    return successResponse(res, 200, playlist);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  const { playlistId, songId } = req.params;
  const userId = req.user._id;
  try {
    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        $or: [{ createdBy: userId }, { collaborators: userId }],
        "songs.song": songId,
      },
      {
        $pull: { songs: { song: songId } },
      },
      { new: true },
    ).populate({
      path: "songs",
      select: "song",
      populate: {
        path: "song",
        select: "title",
      },
    });
    if (!playlist) throw new AppError("Song already removed from playlist");
    return successResponse(res, 200, playlist);
  } catch (error) {
    next(error);
  }
};
