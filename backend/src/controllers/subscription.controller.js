import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!channelId) {
        throw new ApiError(400, "Channel Id is required");
    }

    try {
        const existingSubscription = await Subscription.findOne({
            channel: channelId,
            subscriber: userId
        });

        if (existingSubscription) {
            // ✅ Unsubscribe
            await existingSubscription.deleteOne();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { subscribed: false },
                    "Unsubscribed successfully"
                )
            );
        } else {
            // ✅ Subscribe
            const newSubscription = await Subscription.create({
                channel: channelId,
                subscriber: userId
            });

            if (!newSubscription) {
                throw new ApiError(500, "Subscription failed");
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { subscribed: true, id: newSubscription._id },
                    "Subscribed successfully"
                )
            );
        }
    } catch (error) {
        throw new ApiError(500, "Toggle Subscription failed");
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel Id is required");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username email"); // fetch user details

    const count = subscribers.length;

    if (count === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { count: 0, subscribers: [] },
                "No subscribers found"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { count, subscribers },
            "Subscribers fetched successfully"
        )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId){
        throw new ApiError(400,"SubscriberId is required") 
    }

    const subscribedChannels = await Subscription.find({
        subscriber:subscriberId
    }).populate("channel","username email")

    const count = subscribedChannels.length
    if( count===0){
        return res.status(200)
        .json(new ApiResponse(
            200,
            [],
            "No subscribed channel found"
        ))
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            {count,subscribedChannels},
            "Subscribed channel found successfully"
        ))
})



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}