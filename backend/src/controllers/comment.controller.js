import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new ApiError(400, "VideoId is required");
    }

    // Convert to numbers
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) {
        throw new ApiError(400, "Page must be a positive number");
    }
    if (isNaN(limit) || limit < 1) {
        throw new ApiError(400, "Limit must be a positive number");
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fetch comments
    const videoComments = await Comment.find({ video: videoId })
        .populate("owner", "username email") // only populate user info
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // newest first

    // Total comments count
    const totalComments = await Comment.countDocuments({ video: videoId });

    return res.status(200).json(new ApiResponse(
        200,
        {
            comments: videoComments,
            page,
            limit,
            totalComments,
            totalPages: Math.ceil(totalComments / limit)
        },
        "Video comments fetched successfully"
    ));
});


const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;
    const { content } = req.body;

    if (!videoId) throw new ApiError(400, "VideoId is required");
    if (!userId) throw new ApiError(401, "User not authenticated");
    if (!content || content.trim() === "") throw new ApiError(400, "Content is required");

    const videoExists = await Video.findById(videoId);
    if (!videoExists) throw new ApiError(404, "Video not found");

    let comment = await Comment.create({
        video: videoId,
        owner: userId,
        content: content.trim()
    });

    // Auto-populate owner details
    comment = await comment.populate("owner", "username email");

    return res.status(201).json(
        new ApiResponse(
            201,
            { comment },
            "Comment added successfully"
        )
    );
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
        throw new ApiError(400, "CommentId is required");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const updatedComment = await Comment.findById(commentId);

    if (!updatedComment) {
        throw new ApiError(404, "Comment not found");
    }

    // ✅ Ownership check
    if (updatedComment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }

    updatedComment.content = content;
    await updatedComment.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "CommentId is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // ✅ Ownership check (only creator can delete)
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    await comment.deleteOne(); // or comment.remove()

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    );
});

export{
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}