import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import { AppError } from "../utils/ErrorHandler.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { use } from "react";
import { populate } from "dotenv";

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
      .select("-clerkId")
      .populate({ path: "friends", select: "fullName imageUrl" })
      .populate({ path: "playlists", select: "title imageUrl visibility" });
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

export const updateActivity = async (req, res, next) => {
  const userId = req.user._id;
  const { songId, isPlaying } = req.body;
  const io = req.app.get("io");

  try {
    await User.findByIdAndUpdate(userId, {
      $set: {
        "currentPlaying.song": songId,
        "currentPlaying.isPlaying": isPlaying,
      },
      $pull: { lastPlayed: { song: songId } },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { lastPlayed: { song: songId } },
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        lastPlayed: {
          $each: [{ song: songId, playedAt: new Date() }],
          $position: 0,
          $slice: 30,
        },
      },
    });

    const fullSongData = await Song.findById(songId).populate("album", "title");

    io.emit("friend_activity_update", {
      userId,
      isPlaying,
      song: fullSongData,
    });

    return successResponse(res, 204);
  } catch (error) {
    next(error);
  }
};

export const getFriend = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate({
      path: "friends",
      select: "fullName imageUrl currentPlaying lastPlayed",
      populate: [
        {
          path: "currentPlaying.song",
          select: "title performer album imageUrl",
          populate: {
            path: "album",
            select: "title",
          },
        },
        {
          path: "lastPlayed.song",
          select: "title performer album imageUrl",
          populate: {
            path: "album",
            select: "title",
          },
        },
      ],
    });

    if (!user) return next(new Error("User not found"));
    const friendsData = user.friends.map((friend) => {
      const friendObj = friend.toObject();

      if (friendObj.lastPlayed && friendObj.lastPlayed.length > 0) {
        const sortedHistory = friendObj.lastPlayed.sort(
          (a, b) =>
            new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime(),
        );
        friendObj.lastPlayed = [sortedHistory[0]];
      }

      return friendObj;
    });

    return successResponse(res, 200, friendsData);
  } catch (error) {
    next(error);
  }
};

export const getCollection = async (req, res, next) => {
  const userId = req.user._id;
  const { type, visibility } = req.query;
  try {
    const user = await User.findById(userId)
      .select("savedAlbums")
      .populate({
        path: "savedAlbums",
        select: "title imageUrl visibility createdBy",
        populate: {
          path: "createdBy",
          select: "fullName",
        },
      });
    const playlists = await Playlist.find({
      $or: [{ createdBy: userId }, { collaborators: userId }],
    })
      .select("title imageUrl visibility createdBy")
      .populate("createdBy", "fullName");

    let collections = [
      ...user.savedAlbums.map((album) => ({
        _id: album._id,
        title: album.title,
        creator: album.createdBy.fullName,
        imageUrl: album.imageUrl,
        visibility: album.visibility,
        type: "album",
      })),
      ...playlists.map((playlist) => ({
        _id: playlist._id,
        title: playlist.title,
        creator: playlist.createdBy.fullName,
        imageUrl: playlist.imageUrl,
        visibility: playlist.visibility,
        type: "playlist",
      })),
    ];

    if (type) {
      collections = collections.filter((c) => c.type === type);
    }

    if (visibility) {
      collections = collections.filter((c) => c.visibility === visibility);
    }

    collections.sort((a, b) => {
      if (a.title === "Liked Songs") return -1;
      if (b.title === "Liked Songs") return 1;
      return 0;
    });
    return successResponse(res, 200, collections);
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (req, res, next) => {
  const { id } = req.params;
  let totalDuration = 0;
  let imageUrl = null;
  try {
    const albumExist = await Album.exists({ _id: id });
    const playlistExist = await Playlist.exists({ _id: id });
    if (albumExist) {
      const album = await Album.findById(id).populate({
        path: "createdBy",
        select: "fullName imageUrl",
      });
      const songs = await Song.find({ album: id }).populate("album");
      const normalizedSongs = songs.map((song) => {
        totalDuration += song.duration;
        return {
          ...song.toObject(),
          imageUrl: album.imageUrl,
          addedBy: null,
        };
      });
      return successResponse(res, 200, {
        ...album.toObject(),
        songs: normalizedSongs,
        collection: "album",
        duration: totalDuration,
      });
    } else if (playlistExist) {
      const playlist = await Playlist.findById(id)
        .populate({
          path: "songs",
          populate: {
            path: "song",
            populate: {
              path: "album",
            },
          },
        })
        .populate({ path: "createdBy", select: "fullName imageUrl" })
        .populate({ path: "collaborators", select: "fullName imageUrl" });
      const normalizedSongs = playlist.songs.map((s) => ({
        ...s.song.toObject(),
        imageUrl: s.song.album?.imageUrl || null,
        addedBy: s.addedBy || null,
        createdAt: s.addedAt || null,
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

export const checkLikedSong = async (req, res, next) => {
  const userId = req.user._id;
  const { songId } = req.params;

  try {
    const playlist = await Playlist.findOne({
      createdBy: userId,
      title: "Liked Songs",
    });

    if (!playlist) {
      throw new AppError("Liked playlist not found", 404);
    }

    const isLiked = playlist.songs.some(
      (item) => item.song.toString() === songId,
    );

    return successResponse(res, 200, { exists: isLiked });
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
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { savedAlbums: albumId },
      },
      { new: true },
    );
    return successResponse(res, 204);
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
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { savedAlbums: albumId },
      },
      { new: true },
    );
    return successResponse(res, 204);
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
    return successResponse(res, 204);
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
    return successResponse(res, 204);
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

    const playlist = await Playlist.findOneAndUpdate(
      {
        createdBy: userId,
        title: "Liked Songs",
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
      { new: true },
    );

    if (!playlist) {
      throw new AppError("Liked songs playlist not found", 404);
    }

    return successResponse(res, 204);
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

    const playlist = await Playlist.findOneAndUpdate(
      {
        createdBy: userId,
        title: "Liked Songs",
        "songs.song": songId,
      },
      {
        $pull: { songs: { song: songId } },
      },
      { new: true },
    );

    if (!playlist) {
      throw new AppError("Liked songs playlist not found", 404);
    }

    return successResponse(res, 204);
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
    return successResponse(res, 204);
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
    return successResponse(res, 204);
  } catch (error) {
    next(error);
  }
};
