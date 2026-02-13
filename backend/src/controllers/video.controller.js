import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) {
        throw new ApiError(400, "Page must be a positive number");
    }
    if (isNaN(limit) || limit < 1) {
        throw new ApiError(400, "Limit must be a positive number");
    }

    // Filters
    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // case-insensitive search
    }
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        filter.owner = userId; // use `owner` (based on your Video schema)
    }

    // Sorting
    const sortOrder = sortType === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Pagination
    const skip = (page - 1) * limit;

    // Parallel query: videos + total count
    const [videos, total] = await Promise.all([
        Video.find(filter)
            .populate("owner", "username email")
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Video.countDocuments(filter)
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                total,
                limit,
                page,
                pages: Math.ceil(total / limit)
            },
            "Videos fetched successfully"
        )
    );
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    if([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const videoUpload = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload) {
        throw new ApiError(500, "Video upload failed");
    }
    if (!thumbnailUpload) {
        throw new ApiError(500, "Thumbnail upload failed");
    }

    try {
        const video = await Video.create({
            videoFile: videoUpload.url,
            thumbnail: thumbnailUpload.url,
            title,
            description,
            duration: videoUpload.duration || 0, // Fallback if duration is missing
            owner: req.user._id,
            isPublished: true
        });

        return res.status(201).json(
            new ApiResponse(201, video, "Video published successfully")
        );
    } catch (error) {
        console.error("Error creating video in DB:", error);
        throw new ApiError(500, "Database creation failed: " + error.message);
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId){
        throw new ApiError(400,"VideoId is not present")
    }

    const video = await Video.findById(videoId).populate("owner", "username avatar");
    if(!video){
        throw new ApiError(404,"Video is not present")
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        video,
        "VideoId fetched successfully "
    ))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!videoId){
        throw new ApiError(400,"VideoId is not present")
    }

    const {title,description,thumbnail} = req.body
    
    if(!title){
        throw new ApiError(400,"Title is required")
    }
    if(!description){
        throw new ApiError(400,"description is required")
    }
    if(!thumbnail){
        throw new ApiError(400,"thumbnail is required")
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        { title, description, thumbnail },
        { new: true, runValidators: true }
    );
    if(!video){
        throw new ApiError(404,"video not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,
            video,
            "Update in Video is successfull"
        )
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "VideoId is required");
    }

    let video;
    try {
        video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        // ✅ Ownership check (after we know video exists)
        if (video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this video");
        }

        await video.deleteOne(); // run delete safely

    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // preserve custom errors
        }
        throw new ApiError(500, "Video deletion failed");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { id: video._id }, 
            "Video deleted successfully"
        )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "VideoId is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Flip the publish status
    video.isPublished = !video.isPublished;

    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: video.isPublished },
            `Video is now ${video.isPublished ? "published" : "unpublished"}`
        )
    );
});


export  {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}