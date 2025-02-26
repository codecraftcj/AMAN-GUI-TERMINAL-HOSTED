import React from "react";

const WaterParameters = ({ waterParameters, loading }) => {
  return (
    <div className="mt-8 w-full p-10">
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
            <div
              key={label}
              className="bg-white p-6 rounded-lg shadow-md text-center w-full transition-all duration-300 hover:shadow-lg"
            >
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
