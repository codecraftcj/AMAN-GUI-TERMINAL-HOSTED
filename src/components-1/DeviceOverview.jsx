import { useEffect, useState } from "react";
import {
  fetchLatestWaterParameters,
  fetchDeviceJobs,
  fetchDeviceCameraURL,
  sendDeviceCommand,
  fetchModelInference,
} from "../services/api";

const DEVICE_ID = "EMULATOR-001";

const DeviceOverview = () => {
  const [waterParameters, setWaterParameters] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cameraURL, setCameraURL] = useState(null);
  const [modelInferenceImage, setModelInferenceImage] = useState(null);
  const [isInferenceLoading, setIsInferenceLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fetchWaterParameters();
        await fetchDeviceJobsJSON();
        await fetchDeviceCamera();
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchWaterParameters, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const fetchWaterParameters = async () => {
    try {
      const data = await fetchLatestWaterParameters();
      setWaterParameters(data);
    } catch (error) {
      console.error("Error fetching water parameters:", error);
    }
  };

  const fetchDeviceJobsJSON = async () => {
    try {
      const jobData = await fetchDeviceJobs(DEVICE_ID);
      setJobs(jobData);
    } catch (error) {
      console.error("Error fetching device jobs:", error);
    }
  };

  const fetchDeviceCamera = async () => {
    try {
      const cameraUrl = await fetchDeviceCameraURL(DEVICE_ID);
      setCameraURL(cameraUrl);
    } catch (error) {
      console.error("Error fetching camera feed:", error);
    }
  };

  const handleFetchModelInference = async () => {
    setIsInferenceLoading(true);
    setModelInferenceImage(null);
    try {
      const imageUrl = await fetchModelInference(DEVICE_ID);
      setModelInferenceImage(imageUrl);
    } catch (error) {
      console.error("Error fetching model inference:", error);
    } finally {
      setIsInferenceLoading(false);
    }
  };

  const handleSendCommand = async (command) => {
    try {
      await sendDeviceCommand(DEVICE_ID, command);
      console.log(`Command sent: ${command}`);
      fetchDeviceJobsJSON();
      setTimeout(fetchDeviceJobsJSON, 5000);
    } catch (error) {
      console.error(`Failed to send command: ${command}`, error);
    }
  };

  return (
    <div className="w-full p-15 min-h-screen">
      {/* Device Overview Header */}
      <div className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-900 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">AMAN Device</h2>
        <p className="text-sm text-gray-200">Select Device</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-lg">
          {[
            { label: "Enclosure ID", value: waterParameters?.device_id || "C1_PG" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-bold">{value}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Water Parameters */}
      <div className="mt-8 w-full">
        <h2 className="text-3xl font-bold text-gray-900">Water Parameters</h2>
        <p className="text-gray-500">Live data from your connected devices.</p>

        {loading ? (
          <p className="text-gray-500 mt-4">Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
            {[
              { label: "PH Level", value: waterParameters?.ph_level, unit: "", status: "Neutral" },
              { label: "Dissolved Oxygen", value: "No Data", unit: "", status: "Neutral" },
              { label: "Temperature", value: `${waterParameters?.temperature}°C`, status: "Normal" },
              { label: "Turbidity", value: waterParameters?.turbidity, unit: "NTU", status: "Neutral" },
              { label: "Salinity", value: "No Data", unit: "", status: "Neutral" },
              { label: "Hydrogen Sulfide", value: waterParameters?.hydrogen_sulfide_level, unit: "ppm", status: "Neutral" },
            ].map(({ label, value, unit, status }) => (
              <div key={label} className="bg-white p-6 rounded-lg shadow-md text-center w-full">
                <p className="text-lg font-semibold">{label}</p>
                <p className="text-gray-500">{status}</p>
                <div className="text-4xl font-bold text-blue-700 mt-2">{value} {unit}</div>
                <p className="text-gray-400 text-sm">Value</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Device Jobs Section */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full">
        <h3 className="text-xl font-bold">Motor Controls</h3>
        <div className="flex flex-wrap space-x-4 mt-4 ">
          {["Small Open", "Half Open", "Full Open"].map((cmd) => (
            <button
              key={cmd}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition mr-10"
              onClick={() => handleSendCommand(cmd.toLowerCase())}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Feed */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full">
        <h3 className="text-xl font-bold">Camera Feed</h3>
        {cameraURL ? (
          <img src={cameraURL} alt="Camera Feed" className="mt-4 w-full rounded-lg shadow" />
        ) : (
          <p className="text-gray-500">No camera feed available</p>
        )}
      </div>
    </div>
  );
};

export default DeviceOverview;
