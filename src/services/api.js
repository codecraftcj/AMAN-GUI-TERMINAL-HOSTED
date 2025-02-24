import axios from "axios";

export const API_URL = "http://simplegon-desktop:8080";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // If using cookies
});

export const loginUser = async (credentials) => {
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

export const fetchLatestWaterParameters = async () => { //@TODO: modify to get the latest water parameters of 1 device only
    const response = await api.get("/water-parameters/latest");
    return response.data;
}

export const fetchDeviceJobs = async (device_id) => {
    const response = await api.get(`/device/${device_id}/jobs`);
    return response.data;
}


export const fetchDeviceCameraURL = async (device_id) => {
    let camera_url = `${API_URL}/device/${device_id}/camera`
    return camera_url;
}
