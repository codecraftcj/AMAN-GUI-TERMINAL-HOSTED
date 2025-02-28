import { useEffect, useState } from "react";
import { 
  fetchRegisteredDevices, 
  fetchAvailableDevices, 
  confirmDevice, 
  removeDevice 
} from "../services/api";
import AddDevice from "./AddDevice"; // Import AddDevice component

const ManageDevices = () => {
  const [registeredDevices, setRegisteredDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingDevice, setRemovingDevice] = useState(null); // Track which device is being removed
  const [showAddDevice, setShowAddDevice] = useState(false); // Manage modal visibility

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

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
      alert(`Device ${device_id} confirmed successfully.`);
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Device Management Table */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-lg font-semibold">Device Management</h2>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowAddDevice(true)} // Open modal on click
          >
            Add Device
          </button>
        </div>

        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Device Name</th>
              <th className="p-2">IP Address</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-2">Loading...</td></tr>
            ) : registeredDevices.length > 0 ? (
              registeredDevices.map(({ device_id, hostname }) => (
                <tr key={device_id} className="border-b">
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
              <th className="p-2">Device Name</th>
              <th className="p-2">IP Address</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center py-2">Loading...</td></tr>
            ) : availableDevices.length > 0 ? (
              availableDevices.map(([device_id, info]) => (
                <tr key={device_id} className="border-b">
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
