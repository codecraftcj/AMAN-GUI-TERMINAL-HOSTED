import axios from "axios";

const API_URL = "http://simplegon-desktop:8080";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // If using cookies
});

export const loginUser = async (credentials) => {
    console.log("API URL: ", API_URL)
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

export const fetchUser = async () => {
  const response = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
};

export const fetchLatestWaterParameters = async () => {
    const response = await api.get("/water-parameters/latest");
    return response.data;
    }