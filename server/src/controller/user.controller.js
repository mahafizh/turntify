import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import { AppError } from "../utils/ErrorHandler.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";

export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find().select("fullName imageUrl");
    if (user.length === 0) {
      throw new AppError("User is empty", 404);
    }
    return successResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .populate("friends", "fullName")
      .populate("savedAlbums", "title")
      .populate("playlists", "title")
      .populate("likedSongs", "title");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return successResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const fullName = req.body?.fullName;
  let oldImageurl;
  let newImageurl;
  try {
    const user = await User.findById(id);
    if (fullName !== undefined) user.fullName = fullName;
    if (req.files?.imageFile) {
      if (user.imageUrl && !user.imageUrl.includes("img.clerk.com")) {
        oldImageurl = user.imageUrl;
      }
      newImageurl = await uploadToCloudinary(req.files.imageFile);
      user.imageUrl = newImageurl;
    }
    const updatedUser = await user.save();
    if (oldImageurl) await deleteFromCloudinary(oldImageurl);
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    if (newImageurl) await deleteFromCloudinary(newImageurl);
    next(error);
  }
};

export const getFriend = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate(
      "friends",
      "fullName imageUrl",
    );
    const friends = user.friends;
    return successResponse(res, 200, friends);
  } catch (error) {
    next(error);
  }
};

export const getCollection = async (req, res, next) => {
  const userId = req.user._id;
  const { type } = req.query;
  try {
    const user = await User.findById(userId)
      .select("savedAlbums")
      .populate({
        path: "savedAlbums",
        select: "title imageUrl createdBy",
        populate: {
          path: "createdBy",
          select: "fullName",
        },
      });
    const playlists = await Playlist.find({
      $or: [{ createdBy: userId }, { collaborators: userId }],
    })
      .select("title imageUrl createdBy")
      .populate("createdBy", "fullName");

    const collections = [
      ...user.savedAlbums.map((album) => ({
        _id: album._id,
        title: album.title,
        creator: album.createdBy.fullName,
        imageUrl: album.imageUrl,
        type: "album",
      })),
      ...playlists.map((playlist) => ({
        _id: playlist._id,
        title: playlist.title,
        creator: playlist.createdBy.fullName,
        imageUrl: playlist.imageUrl,
        type: "playlist",
      })),
    ];
    let filteredCollection = collections;
    if (type === "album" || type === "playlist") {
      filteredCollection = collections.filter((c) => c.type === type);
    }
    return successResponse(res, 200, filteredCollection);
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (req, res, next) => {
  const { id } = req.params;
  let totalDuration = 0;
  try {
    const albumExist = await Album.exists({ _id: id });
    const playlistExist = await Playlist.exists({ _id: id });
    if (albumExist) {
      const album = await Album.findById(id).populate({
        path: "createdBy",
        select: "fullName",
      });
      const songs = await Song.find({ album: id })
      const normalizedSongs = songs.map((song)=>{
        totalDuration += song.duration
        return {
          ...song.toObject(),
          addedBy: null
        }
      })
      return successResponse(res, 200, {
        ...album.toObject(),
        songs: normalizedSongs,
        collection: "album",
        duration: totalDuration,
      });
    } else if (playlistExist) {
      const playlist = await Playlist.findById(id).populate({
        path: "songs",
        populate: {
          path: "song",
        },
      }).populate({path: "createdBy", select: "fullName" });

      const normalizedSongs = playlist.songs.map((song) => ({
        ...song.song.toObject(),
        addedBy: song.addedBy,
        createdAt: song.addedAt,
      }));

      normalizedSongs.forEach((song) => {
        totalDuration += song.duration;
      });

      return successResponse(res, 200, {
        ...playlist.toObject(),
        collection: "playlist",
        songs: normalizedSongs,
        duration: totalDuration,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const addSavedAlbum = async (req, res, next) => {
  const userId = req.user._id;
  const { albumId } = req.params;
  try {
    const exist = await Album.exists({ _id: albumId });
    if (!exist) throw new AppError("Album not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { savedAlbums: albumId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const removeSavedAlbum = async (req, res, next) => {
  const userId = req.user._id;
  const { albumId } = req.params;
  try {
    const exist = await Album.exists({ _id: albumId });
    if (!exist) throw new AppError("Album not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { savedAlbums: albumId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const addPlaylist = async (req, res, next) => {
  const userId = req.user._id;
  const { playlistId } = req.params;
  try {
    const exist = await Playlist.exists({ _id: playlistId });
    if (!exist) throw new AppError("Playlist not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { playlists: playlistId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const removePlaylist = async (req, res, next) => {
  const userId = req.user._id;
  const { playlistId } = req.params;
  try {
    const exist = await Playlist.exists({ _id: playlistId });
    if (!exist) throw new AppError("Playlist not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { playlists: playlistId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const addLikedSong = async (req, res, next) => {
  const userId = req.user._id;
  const { songId } = req.params;
  try {
    const exist = await Song.exists({ _id: songId });
    if (!exist) throw new AppError("Song not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { likedSongs: songId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const removeLikedSong = async (req, res, next) => {
  const userId = req.user._id;
  const { songId } = req.params;
  try {
    const exist = await Song.exists({ _id: songId });
    if (!exist) throw new AppError("Song not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { likedSongs: songId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const addFriend = async (req, res, next) => {
  const userId = req.user._id;
  const { friendId } = req.params;
  try {
    if (userId.toString() === friendId)
      throw new AppError("You can't added yourself", 400);
    const exist = await User.exists({ _id: friendId });
    if (!exist) throw new AppError(res, "User not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friends: friendId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const removeFriend = async (req, res, next) => {
  const userId = req.user._id;
  const { friendId } = req.params;
  try {
    const exist = await User.exists({ _id: friendId });
    if (!exist) throw new AppError("User not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: friendId },
      },
      { new: true },
    );
    return successResponse(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};
