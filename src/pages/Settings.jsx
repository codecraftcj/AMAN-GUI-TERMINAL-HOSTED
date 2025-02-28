import React, { useState } from "react";

const Settings = () => {
  const [feedDensity, setFeedDensity] = useState(50); // Default value: 50
  const [enableFeedDensity, setEnableFeedDensity] = useState(true); // Toggle ON by default

  const handleFeedDensityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 10 && value <= 200) {
      setFeedDensity(value);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold pb-2 border-b">Settings</h3>

      {/* Toggle for Feed Density Control */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm font-semibold">Enable Feed Density Control</span>
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={enableFeedDensity} 
            onChange={() => setEnableFeedDensity(!enableFeedDensity)}
            className="hidden"
          />
          <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${enableFeedDensity ? "bg-green-500" : ""}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${enableFeedDensity ? "translate-x-5" : ""}`}></div>
          </div>
        </label>
      </div>

      {/* Feed Density Input */}
      {enableFeedDensity && (
        <div className="mt-4">
          <label className="block text-sm font-semibold">Feed Density (grams per cycle):</label>
          <input
            type="number"
            min="10"
            max="200"
            value={feedDensity}
            onChange={handleFeedDensityChange}
            className="w-full p-2 mt-2 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Set feed density between 10g and 200g per cycle.</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
