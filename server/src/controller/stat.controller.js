import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getStatistic = async (req, res) => {
  const userId = req.user._id;

  try {
    const [totalSongs, totalAlbums, listenerStats] = await Promise.all([
      Song.countDocuments({ createdBy: userId }),
      Album.countDocuments({ createdBy: userId }),
      Song.aggregate([
        { $match: { createdBy: userId } },
        {
          $group: {
            _id: null,
            totalListeners: { $sum: "$played" },
          },
        },
      ]),
    ]);

    const totalListener =
      listenerStats.length > 0 ? listenerStats[0].totalListeners : 0;

    return successResponse(res, 200, {
      totalSongs,
      totalAlbums,
      totalListeners: totalListener,
    });
  } catch (error) {
    console.error("Statistic Error:", error);
    return errorResponse(res, 500, "Statistic Retrieve Failed");
  }
};
