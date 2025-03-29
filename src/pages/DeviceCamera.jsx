import React, { useState, useEffect } from "react";
import { fetchDeviceCameraURL } from "../services/api"; // Ensure this API function is implemented
import Swal from "sweetalert2";

const DeviceCamera = ({ deviceId }) => {
  const [cameraUrl, setCameraUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCameraStream();
  }, [deviceId]);

  const fetchCameraStream = async () => {
    setLoading(true);
    setError(null);
    try {
      const responseURL = await fetchDeviceCameraURL(deviceId);
      setCameraUrl(responseURL);
    } catch (err) {
      console.error("Error fetching camera stream:", err);
      setError("Failed to load camera feed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Device Camera</h3>
      {loading ? (
        <p className="text-gray-500">Loading camera feed...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="relative w-full h-auto">
          <img
            src={cameraUrl}
            alt="Device Camera Feed"
            className="w-full rounded-lg border"
            onError={() => setError("Error displaying the camera feed.")}
          />
        </div>
      )}
      <button
        onClick={fetchCameraStream}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Refresh Feed
      </button>
    </div>
  );
};

export default DeviceCamera;
