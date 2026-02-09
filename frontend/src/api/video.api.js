import api from "./axios";

export const getAllVideos = () =>
  api.get("/videos");

export const getVideoById = (id) =>
  api.get(`/videos/${id}`);

export const uploadVideo = (formData) =>
  api.post("/videos", formData);