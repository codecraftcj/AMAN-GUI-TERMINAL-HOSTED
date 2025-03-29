import { useEffect, useState } from "react";
import { 
  fetchRegisteredDevices, 
  fetchAvailableDevices, 
  confirmDevice, 
  removeDevice,
  fetchDeviceOverview,
  fetchLatestWaterParameters,
  
  sendDeviceCommand,
  getDeviceFeedingSchedule,
  setDeviceFeedingSchedule,
} from "../services/api";
import Swal from "sweetalert2";
import { IoAddOutline, IoClose } from "react-icons/io5";
import AddDevice from "./AddDevice"; // Import AddDevice component
import FeedingSchedule from "./FeedingSchedule";
import JobQueue from "./JobQueue";
import DeviceCamera from "./DeviceCamera"
import MotorControls from "./MotorControls"

const ManageDevices = () => {
  const [registeredDevices, setRegisteredDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("device-info");
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [waterParameters, setWaterParameters] = useState(null);
  const [feedingSchedule, setFeedingSchedule] = useState(null);
  const [removingDevice, setRemovingDevice] = useState(null); // Track which device is being removed
  const [showAddDevice, setShowAddDevice] = useState(false); // Manage modal visibility

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);
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
  const loadDevices = async () => {
    setLoading(true);
    try {
      const registered = await fetchRegisteredDevices();
      setRegisteredDevices(registered);

      const available = await fetchAvailableDevices();
      setAvailableDevices(Object.entries(available)); // Convert object to array
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setLoading(false);
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
      setAvailableDevices(availableDevices.filter(([id]) => id !== device_id)); // Remove from available list
      loadDevices(); // Refresh registered devices
    } catch (error) {
      alert(`Failed to confirm device: ${error.message}`);
    }
  };

  const handleRemoveDevice = async (device_id) => {
    setRemovingDevice(device_id);
    try {
      await removeDevice(device_id);
      Swal.fire({
              icon: "success",
              title: "Disconnected!",
              text: `Device ${device_id} disconnected successfully.`,
              showConfirmButton: false,
              timer: 2000,
            });
      setRegisteredDevices(registeredDevices.filter(device => device.device_id !== device_id)); // Remove from registered list
    } catch (error) {
      alert("Failed to remove device");
    } finally {
      setRemovingDevice(null); // Reset loading state
    }
  };

  const handleAddDevice = (newDevice) => {
    setRegisteredDevices([...registeredDevices, newDevice]); // Add new device to the list
    setShowAddDevice(false); // Close the modal after adding the device
  };

  return (


    <div className="p-4 bg-gray-100 min-h-screen">
       <div className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-900 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Manage Your Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 text-lg">
          {[{ label:"Stay in control of your networked devices with real-time status updates, easy connectivity, and seamless integration." , value: "Effortlessly Connect, Monitor, and Manage Your Devices."  }]
            .map(({ label, value }) => (
              <div key={label} className="text-left">
                <p className="font-bold">{value}</p>
                <p className="text-gray-300 text-sm">{label}</p>
              </div>
            ))}
        </div>
      </div>
      {/* Device Management Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto p-4 mt-5">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold">Device Management</h2>
          
        </div>

        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Host Name</th>
              <th className="p-2">Device ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-2">Loading...</td></tr>
            ) : registeredDevices.length > 0 ? (
              registeredDevices.map(({ device_id, hostname }) => (
                <tr onClick={() => openDeviceModal({ device_id, hostname })} key={device_id} className="border-b cursor-pointer overflow-x-auto">
                  <td className="p-2">{hostname || "Unknown Device"}</td>
                  <td className="p-2">{device_id}</td>
                  <td className="p-2">Jan 11, 2050</td>
                  <td className="p-2">
                    <button
                      className={`py-1 px-3 rounded text-white ${
                        removingDevice === device_id ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                      }`}
                      onClick={() => handleRemoveDevice(device_id)}
                      disabled={removingDevice === device_id}
                    >
                      {removingDevice === device_id ? (
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : "Remove"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-2">No registered devices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Available Devices Table */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-6">
        <h2 className="text-lg font-semibold pb-4 border-b">Available Devices</h2>

        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Host Name</th>
              <th className="p-2">Device ID</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center py-2">Loading...</td></tr>
            ) : availableDevices.length > 0 ? (
              availableDevices.map(([device_id, info]) => (
                <tr  key={device_id} className="border-b">
                  <td className="p-2">{info.hostname || "Unnamed Device"}</td>
                  <td className="p-2">{device_id}</td>
                  <td className="p-2 text-blue-600 font-bold cursor-pointer" 
                    onClick={() => handleConfirmDevice(device_id)}>
                    CONNECT
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="text-center py-2">No available devices found.</td></tr>
            )}
          </tbody>
        </table>
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
                  <button
                    onClick={() => setActiveTab("camera-view")}
                    className={`py-2 px-4 ${activeTab === "camera-view" ? "border-b-2 border-blue-500" : ""}`}
                  >
                    Camera View
                  </button>
                  <button
                    onClick={() => setActiveTab("motor-controls")}
                    className={`py-2 px-4 ${activeTab === "motor-controls" ? "border-b-2 border-blue-500" : ""}`}
                  >
                    Motor Controls
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
                {/* Device Camera */}
                {activeTab === "camera-view" && <DeviceCamera deviceId={selectedDevice.device_id} />}
                {activeTab === "motor-controls" && <MotorControls deviceId={selectedDevice.device_id} />}
              </div>
            </div>
          )}
      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AddDevice 
              onCancel={() => setShowAddDevice(false)} 
              onSave={handleAddDevice} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDevices;
