import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // 1️⃣ Get all videos by this channel
    const allVideos = await Video.find({ owner: userId });

    // 2️⃣ Total videos
    const totalVideos = allVideos.length;

    // 3️⃣ Total views
    const totalViews = allVideos.reduce((sum, video) => sum + (video.views || 0), 0);

    // 4️⃣ Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    // 5️⃣ Total likes across all channel videos
    const videoIds = allVideos.map(v => v._id);
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    // ✅ Response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes
            },
            "Channel stats fetched successfully"
        )
    );
});



const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // Get all videos uploaded by the channel, include owner details
    const allChannelVideos = await Video.find({ owner: userId })
        .populate("owner", "username email");

    if (allChannelVideos.length === 0) {
        return res.status(200).json(new ApiResponse(
            200,
            [],
            "No videos uploaded by this channel"
        ));
    }

    return res.status(200).json(new ApiResponse(
        200,
        allChannelVideos,
        "Videos uploaded by the channel fetched successfully"
    ));
});

export{
    getChannelStats,
    getChannelVideos
}
