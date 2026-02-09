import api from "./axios";

export const getVideoComments = (videoId) =>
  api.get(`/comments/${videoId}`);

export const addComment = (videoId, content) =>
  api.post(`/comments/${videoId}`, { content });