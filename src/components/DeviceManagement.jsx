import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  fetchRegisteredDevices,
  fetchAvailableDevices,
  confirmDevice,
  removeDevice,
  sendDeviceCommand,
} from "../services/api";
import { IoWifiOutline, IoLockClosedOutline } from "react-icons/io5";
import Modal from "./components/Modal"; // Custom Modal Component

const DeviceManagement = () => {
  const [registeredDevices, setRegisteredDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const registered = await fetchRegisteredDevices();
      setRegisteredDevices(registered);

      const available = await fetchAvailableDevices();
      setAvailableDevices(Object.entries(available));
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDevice = async (device_id) => {
    try {
      await confirmDevice(device_id);

      // ✅ Success Alert using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Connected!",
        text: `Device ${device_id} connected successfully.`,
        showConfirmButton: false,
        timer: 2000, // Auto close after 2 seconds
      });

      // Remove from available devices, add to registered devices
      setAvailableDevices(availableDevices.filter(([id]) => id !== device_id));
      loadDevices();
    } catch (error) {
      // ❌ Error Alert using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text: `Failed to connect to device ${device_id}.`,
      });
    }
  };

  const handleRemoveDevice = async (device_id) => {
    try {
      await removeDevice(device_id);
      loadDevices();
    } catch (error) {
      console.error("Error removing device:", error);
    }
  };

  const handleSendCommand = async (device_id, command) => {
    try {
      await sendDeviceCommand(device_id, command);
      console.log(`Command sent: ${command}`);

      // ✅ Success Alert
      Swal.fire({
        icon: "success",
        title: "Command Sent",
        text: `The ${command} command was successfully sent to ${device_id}.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error(`Failed to send command: ${command}`, error);

      // ❌ Error Alert
      Swal.fire({
        icon: "error",
        title: "Command Failed",
        text: `The ${command} command could not be sent to ${device_id}.`,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold">Device Management</h2>

      {/* Available Devices List (On Load) */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Available Devices</h3>
        {loading ? (
          <p>Loading...</p>
        ) : availableDevices.length > 0 ? (
          availableDevices.map(([device_id, info]) => (
            <div key={device_id} className="p-4 bg-gray-200 rounded-lg mt-2 flex justify-between items-center">
              <span>{device_id} ({info.hostname})</span>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleConfirmDevice(device_id)}
              >
                Connect
              </button>
            </div>
          ))
        ) : (
          <p>No available devices.</p>
        )}
      </div>

      {/* Registered Devices List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {registeredDevices.map((device) => (
          <div
            key={device.device_id}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
            onClick={() => setSelectedDevice(device)}
          >
            <h3 className="text-lg font-semibold">{device.device_id}</h3>
            <p className="text-gray-600">{device.hostname || "Unknown Host"}</p>
            <span
              className={`text-sm font-bold ${
                device.status === "connected" ? "text-green-600" : "text-red-600"
              }`}
            >
              {device.status}
            </span>
          </div>
        ))}
      </div>

      {/* Device Details Modal */}
      {selectedDevice && (
        <Modal onClose={() => setSelectedDevice(null)}>
          <h3 className="text-xl font-bold">{selectedDevice.device_id}</h3>
          <p className="text-gray-600">{selectedDevice.hostname}</p>

          {/* Tabs */}
          <div className="mt-4 flex space-x-4 border-b">
            <button className="py-2 px-4 border-b-2 border-blue-500">Device Overview</button>
            <button className="py-2 px-4">Motor Controls</button>
          </div>

          {/* Device Overview */}
          <div className="mt-4">
            <p><strong>Device ID:</strong> {selectedDevice.device_id}</p>
            <p><strong>Status:</strong> {selectedDevice.status}</p>
          </div>

          {/* Motor Controls */}
          <div className="mt-4">
            <h3 className="text-lg font-bold">Motor Controls</h3>
            <div className="flex space-x-2 mt-2">
              {["Small Open", "Half Open", "Full Open"].map((cmd) => (
                <button
                  key={cmd}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleSendCommand(selectedDevice.device_id, cmd.toLowerCase())}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DeviceManagement;
