import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
    savedAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
    likedPlaylist: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist" },
    currentPlaying: {
      song: { type: Schema.Types.ObjectId, ref: "Song" },
      isPlaying: { type: Boolean, default: false },
      updatedAt: { type: Date, default: Date.now },
    },
    lastPlayed: [
      {
        songId: { type: Schema.Types.ObjectId, ref: "Song" },
        playedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
