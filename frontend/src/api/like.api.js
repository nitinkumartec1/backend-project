import api from "./axios";

export const toggleVideoLike = (videoId) =>
  api.post(`/likes/toggle/v/${videoId}`);

export const getVideoLikes = (videoId) =>
  api.get(`/likes/v/${videoId}`);