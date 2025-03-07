import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchAvailableDevices,
  fetchDeviceOverview,
  fetchLatestWaterParameters,
  confirmDevice,
  removeDevice,
  sendDeviceCommand,
  getDeviceFeedingSchedule,
  setDeviceFeedingSchedule,
} from "../services/api";
import { IoAddOutline, IoClose } from "react-icons/io5";
import AddDevice from "./AddDevice"; // Import AddDevice component
import FeedingSchedule from "./FeedingSchedule";
import JobQueue from "./JobQueue";

const STATUS_COLORS = {
  connected: "bg-green-500",
  available: "bg-yellow-500",
  offline: "bg-gray-400",
};

const ManageDevices = () => {
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState("device-info");
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [waterParameters, setWaterParameters] = useState(null);
  const [feedingSchedule, setFeedingSchedule] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const available = await fetchAvailableDevices();
      let parsedDevices = Object.entries(available).map(([device_id, info]) => ({
        device_id,
        hostname: info.hostname || "Unknown",
        status: info.status || "AVAILABLE",
      }));

      // Retrieve stored connected devices from localStorage
      const storedConnectedDevices = JSON.parse(localStorage.getItem("connectedDevices")) || [];

      // Merge connected devices with fetched devices
      parsedDevices = parsedDevices.map((device) => ({
        ...device,
        status: storedConnectedDevices.includes(device.device_id) ? "CONNECTED" : device.status,
      }));

      // Add stored connected devices if not already in the list
      storedConnectedDevices.forEach((device_id) => {
        if (!parsedDevices.some((device) => device.device_id === device_id)) {
          parsedDevices.push({
            device_id,
            status: "connected",
          });
        }
      });

      setAvailableDevices(parsedDevices);
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeviceModal = async (device) => {
    setSelectedDevice(device);
    setActiveTab("device-info");

    try {
      const deviceData = await fetchDeviceOverview(device.device_id);
      const waterParams = await fetchLatestWaterParameters();
      const feedingData = await getDeviceFeedingSchedule(device.device_id); 
      setDeviceInfo(deviceData);
      setWaterParameters(waterParams);
      setFeedingSchedule(feedingData.schedule); // FIXED: Store feeding schedule
    } catch (error) {
      console.error("Error fetching device/sensor data:", error);
    }
  };
  const handleSubmitFeedingSchedule = async () => {
    if (!feedingSchedule) return;

    try {
      await setDeviceFeedingSchedule(selectedDevice.device_id, feedingSchedule);
      Swal.fire({
        icon: "success",
        title: "Feeding Schedule Saved!",
        text: "The feeding schedule has been successfully updated.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: "Could not update the feeding schedule.",
      });
    }
  };
  const handleConfirmDevice = async (device_id) => {
    try {
      await confirmDevice(device_id);
      Swal.fire({
        icon: "success",
        title: "Connected!",
        text: `Device ${device_id} connected successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Store connected device in localStorage
      const storedConnectedDevices = JSON.parse(localStorage.getItem("connectedDevices")) || [];
      if (!storedConnectedDevices.includes(device_id)) {
        storedConnectedDevices.push(device_id);
        localStorage.setItem("connectedDevices", JSON.stringify(storedConnectedDevices));
      }

      loadDevices();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text: `Failed to connect to device ${device_id}.`,
      });
    }
  };

  const handleDisconnectDevice = async (device_id) => {
    try {
      await removeDevice(device_id);
      Swal.fire({
        icon: "success",
        title: "Disconnected!",
        text: `Device ${device_id} disconnected successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Remove device from localStorage
      const storedConnectedDevices = JSON.parse(localStorage.getItem("connectedDevices")) || [];
      const updatedConnectedDevices = storedConnectedDevices.filter((id) => id !== device_id);
      localStorage.setItem("connectedDevices", JSON.stringify(updatedConnectedDevices));

      loadDevices();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Disconnection Failed",
        text: `Failed to disconnect device ${device_id}.`,
      });
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold">Manage Devices</h2>

      {/* Available Devices */}
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDevices.length > 0 ? (
              availableDevices.map((device) => (
                <div
                  key={device.device_id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between cursor-pointer"
                  onClick={() => openDeviceModal(device)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{device.device_id}</h3>
                    <div className={`w-4 h-4 rounded-full ${STATUS_COLORS[device.status]}`} />
                  </div>
                  <p className="text-gray-600">{device.hostname}</p>
                  <p className={`text-sm font-bold ${device.status === "connected" ? "text-green-600" : "text-yellow-600"}`}>
                    {device.status.toUpperCase()}
                  </p>
                  {device.status === "connected" ? (
                    <button
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnectDevice(device.device_id);
                      }}
                    >
                      DISCONNECT
                    </button>
                  ) : (
                    <button
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmDevice(device.device_id);
                      }}
                    >
                      CONNECT
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No available devices</p>
            )}
          </div>
        )}
      </div>

    {/* Device Details Modal */}
    {selectedDevice && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[50vw] sm:w-96 max-h-[70vh] relative overflow-y-auto overflow-x-hidden">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={() => setSelectedDevice(null)}
          >
            <IoClose size={24} />
          </button>

          {/* Tabs for Device Details */}
          <div className="flex space-x-4 mt-4 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("device-info")}
              className={`py-2 px-4 ${activeTab === "device-info" ? "border-b-2 border-blue-500" : ""}`}
            >
              Device Info
            </button>
            <button
              onClick={() => setActiveTab("water-parameters")}
              className={`py-2 px-4 ${activeTab === "water-parameters" ? "border-b-2 border-blue-500" : ""}`}
            >
              Water Parameters
            </button>
            <button
              onClick={() => setActiveTab("feeding-schedule")}
              className={`py-2 px-4 ${activeTab === "feeding-schedule" ? "border-b-2 border-blue-500" : ""}`}
            >
              Feeding Schedule
            </button>
            <button
              onClick={() => setActiveTab("job-queue")}
              className={`py-2 px-4 ${activeTab === "job-queue" ? "border-b-2 border-blue-500" : ""}`}
            >
              Job Queue
            </button>
          </div>

          {/* Device Info Tab */}
          {activeTab === "device-info" && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Device Information</h3>
              {deviceInfo ? (
                <div className="mt-2 space-y-2">
                  <p><strong>Device ID:</strong> {deviceInfo.device_id}</p>
                  <p><strong>Hostname:</strong> {deviceInfo.hostname || "Unknown"}</p>
                  <p><strong>Status:</strong> {selectedDevice.status}</p>
                </div>
              ) : (
                <p className="text-gray-500">Loading device info...</p>
              )}
            </div>
          )}

          {/* Water Parameters Tab */}
          {activeTab === "water-parameters" && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Water Parameters</h3>
              {waterParameters ? (
                <div>
                  <p><strong>Temperature:</strong> {waterParameters.temperature}°C</p>
                  <p><strong>pH Level:</strong> {waterParameters.ph_level}</p>
                  <p><strong>Turbidity:</strong> {waterParameters.turbidity} NTU</p>
                  <p><strong>Hydrogen Sulfide:</strong> {waterParameters.hydrogen_sulfide_level} mg/L</p>
                </div>
              ) : (
                <p className="text-gray-500">Loading water parameters...</p>
              )}
            </div>
          )}

          {/* Feeding Schedule Tab */}
          {activeTab === "feeding-schedule" && (
              <FeedingSchedule/>
          )}
          {/* Feeding Schedule Tab */}
          {activeTab === "job-queue" && (
              <JobQueue/>
          )}
        </div>
      </div>
    )}
    </div>
  );
};

export default ManageDevices;