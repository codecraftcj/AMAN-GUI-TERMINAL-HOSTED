import React from "react";
import Swal from "sweetalert2";
import { sendDeviceCommand } from "../services/api"; // Ensure this API function is implemented

const MotorControls = ({ deviceId }) => {
  const handleSendCommand = async (command) => {
    try {
      await sendDeviceCommand(deviceId, command);
      Swal.fire({
        icon: "success",
        title: "Command Sent!",
        text: `Motor set to ${command}.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send Command",
        text: "Could not control the motor.",
      });
    }
  };

  return (
    <div className="mt-4">
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
  );
};

export default MotorControls;
