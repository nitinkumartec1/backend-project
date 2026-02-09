import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {tweet} = req.body

    if(!tweet){
        throw new ApiError(400,"Tweet content is required")
    }
    let newTweet;
    try {
        newTweet = await Tweet.create({
            content : tweet,
            owner : req.user?._id
        })
    } catch (error) {
        throw new ApiError(500,"Tweet creation failed")
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            newTweet,
            "Tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400,"UserId is required")
    }

    const tweets = await Tweet.find({owner : userId})

    if(!tweets|| tweets.length===0){
        throw new ApiError(404,"No Tweet found for the user")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "User tweets fetched successfully"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if(!tweetId){
        throw new ApiError(400,"TweetId is required")
    }
    if (!content) {
        throw new ApiError(400, "Tweet content is required");
    }
    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,{
            $set:{
                content:content
            },
             
        },{new:true,runValidators:true}
         
    )
    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }
 

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "TweetId is required");
    }

    let tweet;
    try {
        tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }

        // ✅ Authorization check (only owner can delete)
        if (tweet.user.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this tweet");
        }

        await tweet.deleteOne();

    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // keep custom error codes
        }
        throw new ApiError(500, "Tweet deletion failed");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { id: tweet._id },
            "Tweet deleted successfully"
        )
    );
});



export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}