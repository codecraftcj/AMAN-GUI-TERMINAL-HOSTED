import { useState } from "react";

const AddDevice = ({ onCancel, onSave }) => {
  const [deviceName, setDeviceName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!deviceName || !ipAddress) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Device added successfully!");

      // Call parent function if provided
      if (onSave) onSave({ deviceName, ipAddress });

      // Reset form
      setDeviceName("");
      setIpAddress("");
    } catch (error) {
      alert("Failed to add device.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Add Device</h2>
      <p className="text-gray-500 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
      </p>

      {/* Device Form */}
      <div className="border rounded-lg p-6">
        <label className="block font-semibold text-gray-700">Device Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded-lg mt-1"
          placeholder="Enter device name"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />

        <label className="block font-semibold text-gray-700 mt-4">IP Address</label>
        <input
          type="text"
          className="w-full border p-2 rounded-lg mt-1"
          placeholder="Enter IP address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
