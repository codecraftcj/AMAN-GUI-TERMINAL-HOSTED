import { useEffect, useState } from "react";
import {
  getNthWaterParameters,
  fetchDeviceJobs,
  fetchDeviceCameraURL,
  sendDeviceCommand,
} from "../services/api";
import { Line } from "react-chartjs-2";
import Analytics from "../pages/Analytics.jsx";
import "chart.js/auto";
import Swal from "sweetalert2"; 
const DEVICE_ID = "EMULATOR-001";

const DeviceOverview = () => {
  const [waterParameters, setWaterParameters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("temperature");
  const [nthRow, setNthRow] = useState(10); // Default fetch limit
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fetchWaterParameters();
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchWaterParameters, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchWaterParameters();
  }, [selectedSensor, nthRow]);

  const fetchWaterParameters = async () => {
    try {
      const data = await getNthWaterParameters(nthRow);
      setWaterParameters(data[data.length - 1]); // Get latest water parameter

      const formattedData = data.map((param) => ({
        time: new Date(param.created_date).toLocaleTimeString(),
        value: param[selectedSensor],
      }));

      setSensorData(formattedData);
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

  const handleSendCommand = async (command) => {
    try {
      Swal.fire({
        title: "Sending Command...",
        text: `Executing ${command.replace("_", " ")} command.`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      console.log("COMMAND ", command);
      await sendDeviceCommand(DEVICE_ID,command); // Simulated API call
  
      Swal.fire({
        icon: "success",
        title: "Command Sent!",
        text: `The "${command.replace("_", " ")}" command was successfully executed.`,
        showConfirmButton: false,
        timer: 2000, // Auto close in 2 seconds
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Command Failed",
        text: `The "${command.replace("_", " ")}" command could not be executed.`,
      });
    }
  };

  return (
    <div className="w-full p-4 min-h-screen">
      {/* Device Overview Header */}
      <div className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-900 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Farm Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 text-lg">
          {[{ label: "Bureau of Fisheries and Aquatic Resources. Fisheries Building Complex, BPI Compound, Visayas Ave, Quezon City, Philippines 1128.", value: "Bureau of Fisheries and Aquatic Resources" }]
            .map(({ label, value }) => (
              <div key={label} className="text-left">
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
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full">
      <h3 className="text-xl font-bold mb-4">Motor Controls</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {[
          { label: "Small Open", command: "small open", color: "bg-blue-500 hover:bg-blue-600" },
          { label: "Half Open", command: "half open", color: "bg-blue-500 hover:bg-blue-600" },
          { label: "Full Open", command: "full open", color: "bg-blue-500 hover:bg-blue-600" },
        ].map(({ label, command, color }) => (
          <button
            key={command}
            className={`w-40 px-6 py-3 text-white rounded-lg transition-all shadow-md ${color}`}
            onClick={() => handleSendCommand(command)}
          >
            {label}
          </button>
        ))}
      </div>
      </div>

      <Analytics/>
    </div>
  );
};

export default DeviceOverview;
