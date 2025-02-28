import axios from "axios";

const TESTING = false

let API_URL_TARGET = "http://simplegon-desktop.local:8080";
if(TESTING){
    API_URL_TARGET = "http://localhost:8080";
}
export const API_URL = API_URL_TARGET;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // If using cookies
  timeout: 30000,
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

export const sendDeviceCommand = async (device_id, command) => {
  try {
      const response = await fetch(`${API_URL}/device/${device_id}/jobs`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ command }),
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Failed to send command");
      }

      return data;
  } catch (error) {
      console.error("Error sending command:", error);
      throw error;
  }
};

export const fetchModelInference = async (device_id) => {
  try {
      const response = await fetch(`${API_URL}/device/${device_id}/model-inference`, {
          method: "GET",
      });

      if (!response.ok) {
          throw new Error("Failed to fetch model inference image");
      }

      // Convert response to blob and create an image URL
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
  } catch (error) {
      console.error("Error fetching model inference:", error);
      throw error;
  }
};
export const fetchRegisteredDevices = async () => {
    try {
        const response = await fetch(`${API_URL}/devices`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch registered devices");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching registered devices:", error);
        throw error;
    }
};

export const fetchAvailableDevices = async () => {
    try {
        const response = await fetch(`${API_URL}/get_available_devices`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch available devices");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching available devices:", error);
        throw error;
    }
};

export const confirmDevice = async (device_id) => {
    try {
        const response = await fetch(`${API_URL}/confirm_device`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error confirming device");
        }

        return data;
    } catch (error) {
        console.error("Error confirming device:", error);
        throw error;
    }
};

export const removeDevice = async (device_id) => {
    try {
        const response = await fetch(`${API_URL}/remove_device`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error removing device");
        }

        return data;
    } catch (error) {
        console.error("Error removing device:", error);
        throw error;
    }
};