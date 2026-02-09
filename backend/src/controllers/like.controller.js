import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!videoId) {
        throw new ApiError(400, "VideoId is required");
    }

    const existingVideoLike = await Like.findOne({
        likedBy: userId,
        video: videoId
    });

    if (existingVideoLike) {
        await Like.deleteOne({ _id: existingVideoLike._id });

        const likeCount = await Like.countDocuments({ video: videoId });

        return res.status(200).json(new ApiResponse(
            200,
            { liked: false, likeCount },
            "Video unliked successfully"
        ));
    } else {
        await Like.create({
            likedBy: userId,
            video: videoId
        });

        const likeCount = await Like.countDocuments({ video: videoId });

        return res.status(200).json(new ApiResponse(
            200,
            { liked: true, likeCount },
            "Video liked successfully"
        ));
    }
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!commentId) {
        throw new ApiError(400, "CommentId is required");
    }

    const existingCommentLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (existingCommentLike) {
        await Like.deleteOne({ _id: existingCommentLike._id });

        const likeCount = await Like.countDocuments({ comment: commentId });

        return res.status(200).json(new ApiResponse(
            200,
            { liked: false, likeCount },
            "Comment unliked successfully"
        ));
    } else {
        await Like.create({
            comment: commentId,
            likedBy: userId
        });

        const likeCount = await Like.countDocuments({ comment: commentId });

        return res.status(200).json(new ApiResponse(
            200,
            { liked: true, likeCount },
            "Comment liked successfully"
        ));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!tweetId) {
        throw new ApiError(400, "TweetId is required");
    }

    const existingTweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (existingTweetLike) {
        await Like.deleteOne({ _id: existingTweetLike._id });

        const likeCount = await Like.countDocuments({ tweet: tweetId });

        return res.status(200).json(new ApiResponse(
            200,
            { liked: false, likeCount },
            "Tweet unliked successfully"
        ));
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        });

        const likeCount = await Like.countDocuments({ tweet: tweetId });

        return res.status(200).json(new ApiResponse(
            200,
            { liked: true, likeCount },
            "Tweet liked successfully"
        ));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const likedVideos = await Like.find({ likedBy: userId })
        .populate("video")  // assuming your Like schema has a `video` field that references Video model
        .select("-__v -updatedAt"); // optional: clean output

    return res.status(200).json(new ApiResponse(
        200,
        { videos: likedVideos.map(like => like.video) }, // extract only video info
        "Liked videos fetched successfully"
    ));
});

export{
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}