import api from "./axios";

export const registerUser = (data) =>
  api.post("/users/register", data);

export const loginUser = (data) =>
  api.post("/users/login", data);

export const getCurrentUser = () =>
  api.get("/users/current-user");

export const logoutUser = () =>
  api.post("/users/logout");