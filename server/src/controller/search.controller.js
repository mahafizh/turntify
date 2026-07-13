import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";
import { successResponse } from "../utils/response.js";

export const globalSearch = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return successResponse(res, 200, { songs: [], albums: [], users: [] });
    }

    const searchRegex = new RegExp(keyword, "i");

    const matchedUsers = await User.find({
      $or: [{ fullName: searchRegex }],
    }).select("_id");

    const userIds = matchedUsers.map((user) => user._id);

    const [songs, albums, users] = await Promise.all([
      Song.find({
        $or: [{ title: searchRegex }, { createdBy: { $in: userIds } }],
      })
        .populate("album")
        .populate("createdBy", "fullName imageUrl")
        .limit(10),

      Album.find({
        $and: [
          { visibility: "public" },
          {
            $or: [{ title: searchRegex }, { createdBy: { $in: userIds } }],
          },
        ],
      })
        .populate("createdBy", "fullName imageUrl")
        .limit(10),

      User.find({
        $or: [{ fullName: searchRegex }],
      })
        .select("fullName username imageUrl")
        .limit(10),
    ]);

    return successResponse(res, 200, {
      songs,
      albums,
      users,
    });
  } catch (error) {
    next(error);
  }
};
