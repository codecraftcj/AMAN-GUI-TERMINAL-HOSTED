import { useState } from "react";

const DeviceScanner = () => {
  const [devices, setDevices] = useState([]);

  const scanDevices = () => {
    setDevices(["Device A", "Device B", "Device C"]);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Add/Remove Devices via Scanning</h2>
      <button
        onClick={scanDevices}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Scan for Devices
      </button>
      <ul className="mt-4">
        {devices.map((device, index) => (
          <li key={index} className="text-gray-300">{device}</li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceScanner;
