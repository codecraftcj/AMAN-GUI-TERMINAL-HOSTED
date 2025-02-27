import { useEffect, useState } from "react";
import {
  getNthWaterParameters,
  fetchDeviceJobs,
  fetchDeviceCameraURL,
  sendDeviceCommand,
} from "../services/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const DEVICE_ID = "EMULATOR-001";

const DeviceOverview = () => {
  const [waterParameters, setWaterParameters] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const interval = setInterval(fetchWaterParameters, 60000);

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
      await sendDeviceCommand(DEVICE_ID, command);
      console.log(`Command sent: ${command}`);
      fetchDeviceJobsJSON();
    } catch (error) {
      console.error(`Failed to send command: ${command}`, error);
    }
  };

  return (
    <div className="w-full p-4 min-h-screen">
      {/* Device Overview Header */}
      <div className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-900 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Farm Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mt-4 text-lg">
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

      {/* Sensor Data Chart */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Sensor Data Over Time</h3>

        {/* Nth Row Selection */}
        <div className="mt-4">
          <label className="block text-sm font-semibold">Select Data Limit (Nth Row):</label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={nthRow}
            onChange={(e) => setNthRow(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p className="text-center text-gray-700">Showing last {nthRow} records</p>
        </div>

        {/* Sensor Selection */}
        <div className="mt-4">
          <label className="block text-sm font-semibold">Select Water Quality Parameter:</label>
          <select
            className="p-2 border border-gray-300 rounded mt-1"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
          >
            <option value="temperature">Temperature</option>
            <option value="turbidity">Turbidity</option>
            <option value="ph_level">pH Level</option>
            <option value="hydrogen_sulfide_level">Hydrogen Sulfide</option>
          </select>
        </div>

        {/* Chart Component */}
        <div className="mt-4">
          <Line
            data={{
              labels: sensorData.map((d) => d.time),
              datasets: [
                {
                  label: selectedSensor,
                  data: sensorData.map((d) => d.value),
                  borderColor: "#3B82F6",
                  borderWidth: 2,
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Sensor Value" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceOverview;
