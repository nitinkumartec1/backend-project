import { Router } from 'express';
import {
    getSubscribedChannels,       // Get all channels the logged-in user (or another user) is subscribed to
    getUserChannelSubscribers,   // Get all subscribers of a given channel
    toggleSubscription,          // Subscribe/unsubscribe to a channel
} from "../controllers/subscription.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // All routes need authentication

// ✅ Subscribe/unsubscribe to a channel
router.route("/c/:channelId").post(toggleSubscription);

// ✅ Get subscribers of a channel
router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);

// ✅ Get channels a user is subscribed to
router.route("/u/:userId/subscriptions").get(getSubscribedChannels);

export default router;
