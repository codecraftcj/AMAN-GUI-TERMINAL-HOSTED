import React, { useState, useEffect } from "react";
import { getNthWaterParameters,updateWaterParametersGSheet } from "../services/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { IoDownloadOutline } from "react-icons/io5"; // Import export icon

const SENSOR_PARAMETERS = [
  { label: "Temperature (°C)", key: "temperature" },
  { label: "pH Level", key: "ph_level" },
  { label: "Turbidity (NTU)", key: "turbidity" },
  { label: "Hydrogen Sulfide (mg/L)", key: "hydrogen_sulfide_level" },
];

const Analytics = () => {
  const [waterData, setWaterData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [loading, setLoading] = useState(true);
  const [nthRow, setNthRow] = useState(10); // Default fetch limit

  useEffect(() => {
    loadWaterData();
  }, [nthRow]);

  const loadWaterData = async () => {
    setLoading(true);
    try {
      const data = await getNthWaterParameters(nthRow);
      console.log("WATER DATA");
      console.log(data);
      setWaterData(data);
    } catch (error) {
      console.error("Error fetching water parameters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for the selected parameter
  const chartData = {
    labels: waterData.map((entry) => new Date(entry.created_date).toLocaleTimeString()),
    datasets: [
      {
        label: selectedParameter.toUpperCase(),
        data: waterData.map((entry) => entry[selectedParameter]),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#3B82F6",
      },
    ],
  };

  // Export all sensor data to CSV
  const handleExport = () => {
    if (!waterData.length) {
      alert("No data available to export.");
      return;
    }

    // CSV Header
    const csvHeader = ["Time", "Temperature (°C)", "pH Level", "Turbidity (NTU)", "Hydrogen Sulfide (mg/L)"];
    const csvRows = waterData.map((entry) => [
      new Date(entry.created_date).toLocaleTimeString(),
      entry.temperature,
      entry.ph_level,
      entry.turbidity,
      entry.hydrogen_sulfide_level,
    ]);

    // Convert to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [csvHeader.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sensor_data_last_${nthRow}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateGSheet = async () => {
    try {
      const response = await updateWaterParametersGSheet(waterData);
      console.log("✅ Success:", response);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };
  return (
    <div className="w-full">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-bold pb-2 border-b">Water Quality Analytics</h3>

        {/* Sensor Tabs */}
        <div className="flex space-x-4 mt-4 border-b overflow-x-auto">
          {SENSOR_PARAMETERS.map(({ label, key }) => (
            <button
              key={key}
              className={`py-2 px-4 border-b-2 ${
                selectedParameter === key ? "border-blue-500 text-blue-600 font-bold" : "text-gray-500"
              }`}
              onClick={() => setSelectedParameter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Nth Row Slider */}
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

        {/* Chart */}
        {loading ? (
          <p className="text-center py-4 text-gray-600">Loading data...</p>
        ) : (
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Trend Analysis (Last {nthRow} Records):</h4>
            <div className="p-4 bg-gray-100 rounded-md">
              <Line data={chartData} />
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
            onClick={handleExport}
          >
            <IoDownloadOutline className="mr-2" size={18} />
            Export All Sensor Data
          </button>
        </div>
        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
            onClick={handleUpdateGSheet}
          >
            <IoDownloadOutline className="mr-2" size={18} />
            Export to GSheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
