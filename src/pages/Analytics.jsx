import React, { useState, useEffect } from "react";
import { getNthWaterParameters } from "../services/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Analytics = () => {
  const [waterData, setWaterData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [loading, setLoading] = useState(true);
  const [nthRow, setNthRow] = useState(10); // Default fetch limit

  useEffect(() => {
    loadWaterData();
  }, [selectedParameter, nthRow]);

  const loadWaterData = async () => {
    setLoading(true);
    try {
      const data = await getNthWaterParameters(nthRow);

      const formattedData = data.map((param) => ({
        time: new Date(param.created_date).toLocaleTimeString(),
        value: param[selectedParameter],
      }));

      setWaterData(formattedData);
    } catch (error) {
      console.error("Error fetching water parameters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: waterData.map((entry) => entry.time),
    datasets: [
      {
        label: selectedParameter.toUpperCase(),
        data: waterData.map((entry) => entry.value),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#3B82F6",
      },
    ],
  };

  return (
    <div className="p-5 mt-20 w-full">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-bold pb-2 border-b">Water Quality Analytics</h3>

        {/* Select Parameter */}
        <div className="mt-4">
          <label className="block text-sm font-semibold">Select Parameter:</label>
          <select
            className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value)}
          >
            <option value="temperature">Temperature (°C)</option>
            <option value="ph_level">pH Level</option>
            <option value="turbidity">Turbidity (NTU)</option>
            <option value="hydrogen_sulfide_level">Hydrogen Sulfide (mg/L)</option>
          </select>
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
      </div>
    </div>
  );
};

export default Analytics;
