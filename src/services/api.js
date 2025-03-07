import axios from "axios";

const TESTING = false;


let API_URL_TARGET = "http://simplegon-desktop.local:8080";
if(TESTING){
    API_URL_TARGET = "http://localhost:8080";
}

export const API_URL = API_URL_TARGET;

// Axios instance with authentication handling
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Adjust based on backend configuration
  timeout: 30000,
});

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized (401) errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);
export const fetchDeviceOverview = async (device_id) => {
  try {
      const response = await api.get(`/device/${device_id}/overview`);
      return response.data;
  } catch (error) {
      console.error("Error fetching device overview:", error);
      throw error;
  }
};
/** 🔹 AUTHENTICATION API **/
export const loginUser = async (credentials) => {
    const response = await api.post("/login", credentials);
    return response.data;  // Ensure backend sends { token, role, ... }
  };

export const fetchUser = async () => {
const token = localStorage.getItem("token");

const response = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
});

return response.data;
};
export const fetchUsers = async () => {
    const response = await api.get("/get-users");
    return response.data;
  };
  
  export const createUser = async (userData) => {
    const response = await api.post("/register-user", userData);
    return response.data;
  };
  
  export const updateUser = async (userId, userData) => {
    const response = await api.put(`/update-user/${userId}`, userData);
    return response.data;
  };
  
  export const deleteUser = async (userId) => {
    const response = await api.delete(`/delete-user/${userId}`);
    return response.data;
  };

export const logoutUser = async () => {
    try {
        await api.post("/logout", {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/"; // Redirect to login
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
};

/** 🔹 DEVICE API **/
export const fetchLatestWaterParameters = async () => {
  const response = await api.get("/water-parameters/latest");
  return response.data;
};

export const fetchDeviceJobs = async (device_id, { nth = null, start = 0, limit = 10 } = {}) => {
  const params = {};

  if (nth !== null) params.nth = nth;  // Fetch a specific Nth row
  if (start !== null) params.start = start;  // Start index for pagination
  if (limit !== null) params.limit = limit;  // Number of jobs to fetch

  const response = await api.get(`/device/${device_id}/jobs`, { params });
  return response.data;
};

export const fetchDeviceCameraURL = async (device_id) => {
  return `${API_URL}/device/${device_id}/camera`;
};

export const fetchTerminalCameraURL = async () => {
  return `${API_URL}/video_feed`;
};

export const sendDeviceCommand = async (device_id, command) => {
  const response = await api.post(`/device/${device_id}/jobs`, { command });
  return response.data;
};

export const fetchModelInference = async (device_id) => {
  const response = await api.get(`/device/${device_id}/model-inference`, { responseType: "blob" });
  return URL.createObjectURL(response.data);
};

/** 🔹 DEVICE MANAGEMENT **/
export const fetchRegisteredDevices = async () => {
  const response = await api.get("/devices");
  return response.data;
};

export const fetchAvailableDevices = async () => {
  const response = await api.get("/get_available_devices");
  return response.data;
};

export const confirmDevice = async (device_id) => {
  const response = await api.post("/confirm_device", { device_id });
  return response.data;
};
export const registerDevice = async (deviceName, ipAddress) => {
  try {
      const response = await api.post("/register_device", {
          device_id: deviceName,
          local_ip: ipAddress
      });

      if (!response.data || response.data.error) {
          throw new Error(response.data?.error || "Error registering device");
      }

      return response.data;
  } catch (error) {
      console.error("Error registering device:", error);
      throw error;
  }
};

export const removeDevice = async (device_id) => {
  const response = await api.delete("/remove_device", { data: { device_id } });
  return response.data;
};

export const fetchJobs = async()=>{
    const response = await api.get("/get-jobs");
    return response.data;
}

// Fetch unread notifications
export const fetchUnreadNotifications = async (start = 0, limit = 10) => {
  const response = await api.get("/notifications/unread", { params: { start, limit } });
  return response.data;
};

// Mark a notification as seen
export const markNotificationAsSeen = async (notification_id) => {
  const response = await api.post("/notifications/mark-seen", { notification_id });
  return response.data;
};

export const processCurrentFrame = async (imageBlob) => {
  const formData = new FormData();
  formData.append("image", imageBlob, "frame.jpg");

  try {
    const response = await api.post("/detect", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob", // Expect an image response
    });

    if (!response || !response.data) {
      throw new Error("No response from the server.");
    }

    return URL.createObjectURL(response.data); // Create a URL for the processed image
  } catch (error) {
    console.error("Error processing frame:", error);
    throw error;
  }
};

export const getNthWaterParameters = async (nth = 10) => {
  try {
    const response = await fetch(`${API_URL}/get-water-parameters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: nth }), // Pass nth as limit
    });

    if (!response.ok) throw new Error("Failed to fetch water parameters");

    return await response.json();
  } catch (error) {
    console.error("Error fetching Nth water parameters:", error);
    return [];
  }
};

/** 🔹 FEEDING SCHEDULE API **/
export const setDeviceFeedingSchedule = async (device_id, schedule) => {
  try {
    const response = await api.post(`/device/${device_id}/feeding-schedule`, { schedule });
    return response.data;
  } catch (error) {
    console.error("Error setting device feeding schedule:", error);
    throw error;
  }
};

export const getDeviceFeedingSchedule = async (device_id) => {
  try {
    const response = await api.get(`/device/${device_id}/feeding-schedule`);
    return response.data;
  } catch (error) {
    console.error("Error fetching device feeding schedule:", error);
    throw error;
  }
};

export const updateWaterParametersGSheet = async (waterParameters) => {
  try {
    const response = await api.post("/update-water-parameters-gsheet", waterParameters);
    return response.data;
  } catch (error) {
    console.error("Error updating water parameters:", error);
    throw error;
  }
};