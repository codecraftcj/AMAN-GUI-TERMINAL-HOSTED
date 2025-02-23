import React from "react";
import { Link } from "react-router-dom";

const SystemManagement = () => {
  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">System Management</h2>
      <p className="text-gray-300 mb-6">Manage your devices and system settings.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Preferences */}
        <Link to="/user/system-preferences" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold">System Preferences</h3>
          <p className="text-gray-400">Configure system-wide settings.</p>
        </Link>

        {/* Select Device */}
        <Link to="/user/select-device" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold">Select Device</h3>
          <p className="text-gray-400">Choose a device to manage.</p>
        </Link>

        {/* Add/Remove Devices */}
        <Link to="/user/device-scanner" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold">Add/Remove Devices</h3>
          <p className="text-gray-400">Scan and manage connected devices.</p>
        </Link>

        {/* Device Overview */}
        <Link to="/user/device-overview" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold">Device Overview</h3>
          <p className="text-gray-400">View details of connected devices.</p>
        </Link>

        {/* Device Controls */}
        <Link to="/user/device-controls" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold">Device Manual Controls</h3>
          <p className="text-gray-400">Manually control system devices.</p>
        </Link>

        {/* Device Settings */}
        <Link to="/user/device-settings" className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h3 className="text-xl font-semibold">Set Device Settings</h3>
          <p className="text-gray-400">Modify configurations for devices.</p>
        </Link>
      </div>
    </div>
  );
};

export default SystemManagement;
