import React, { useEffect, useState } from "react";
import { fetchLatestWaterParameters } from "../services/api";

const WaterParameters = () => {
  const [waterParameters, setWaterParameters] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await fetchLatestWaterParameters();
        if (isMounted) {
          setWaterParameters(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching water parameters:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch new data every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="lg:p-5 sm:p-5  w-full">
      <h2 className="text-3xl font-bold text-gray-900">Water Parameters</h2>
      <p className="text-gray-500">Live data from your connected devices.</p>

      {loading ? (
        <p className="text-gray-500 mt-4">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
          {[
            { label: "PH Level", value: waterParameters?.ph_level ?? "No Data", unit: "", status: "Neutral" },
            { label: "Dissolved Oxygen", value: waterParameters?.dissolved_oxygen ?? "No Data", unit: "mg/L", status: "Neutral" },
            { label: "Temperature", value: `${waterParameters?.temperature ?? "No Data"}°C`, status: "Normal" },
            { label: "Turbidity", value: waterParameters?.turbidity ?? "No Data", unit: "NTU", status: "Neutral" },
            { label: "Salinity", value: waterParameters?.salinity ?? "No Data", unit: "ppt", status: "Neutral" },
            { label: "Hydrogen Sulfide", value: waterParameters?.hydrogen_sulfide_level ?? "No Data", unit: "ppm", status: "Neutral" },
          ].map(({ label, value, unit, status }) => (
            <div key={label} className="bg-white p-6 rounded-lg shadow-md text-center w-full">
              <p className="text-lg font-semibold">{label}</p>
              <p className="text-gray-500">{status}</p>
              <div className="text-4xl font-bold text-blue-700 mt-2">
                {value} {unit}
              </div>
              <p className="text-gray-400 text-sm">Value</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaterParameters;
