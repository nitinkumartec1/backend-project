import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { videoId } = req.params;

    if (!name) {
        throw new ApiError(400, "Name is required");
    }
    if (!description) {
        throw new ApiError(400, "Description is required");
    }

    // Create new playlist with owner
    const playlist = await Playlist.create({
        name,
        description,
        videos: [videoId],        // array so playlist can hold multiple videos
        owner: req.user._id       // logged-in user as playlist owner
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { playlist },
            "Playlist created successfully"
        )
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "UserId is required");
    }

    const playlists = await Playlist.find({ owner: userId })
        .populate("videos", "title thumbnail")   //  corrected (plural)
        .populate("owner", "username email");    // shows playlist owner info

    if (playlists.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "No playlist found"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { count: playlists.length, playlists },
            "Playlists found successfully"
        )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "PlaylistId is required");
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail")
        .populate("owner", "username email");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Count how many videos in the playlist
    const count = playlist.videos.length;

    return res.status(200).json(
        new ApiResponse(
            200,
            { playlist, count },
            "Playlist fetched successfully"
        )
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "PlaylistId is required");
    }
    if (!videoId) {
        throw new ApiError(400, "VideoId is required");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } }, // ensures no duplicates
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { playlist: updatedPlaylist, count: updatedPlaylist.videos.length },
        "Video added in playlist successfully"
    ));
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "PlaylistId is required");
    }
    if (!videoId) {
        throw new ApiError(400, "VideoId is required");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } }, // remove the videoId from videos[]
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { playlist: updatedPlaylist, count: updatedPlaylist.videos.length },
        "Video removed from playlist successfully"
    ));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "PlaylistId is required");
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { playlist },
        "Playlist deleted successfully"
    ));
});


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!playlistId) {
        throw new ApiError(400, "PlaylistId is required");
    }
    if (!name) {
        throw new ApiError(400, "Name is required");
    }
    if (!description) {
        throw new ApiError(400, "Description is required");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,{$set:{name,description}},
        {new:true}
         
    )
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

 

    return res.status(200).json(new ApiResponse(
        200,
        { playlist },
        "Playlist updated successfully"
    ));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}