import api from "./axios";

export const getAllVideos = (params) =>
  api.get("/videos", { params });

export const getVideoById = (id) =>
  api.get(`/videos/${id}`);

export const updateVideo = (id, data) =>
  api.patch(`/videos/${id}`, data);

export const deleteVideo = (id) =>
  api.delete(`/videos/${id}`);

export const togglePublishStatus = (id) =>
  api.patch(`/videos/toggle/publish/${id}`);

export const uploadVideo = (formData) =>
  api.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });