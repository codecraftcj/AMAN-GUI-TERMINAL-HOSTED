import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import Auth Context
import {
  IoHomeOutline,
  IoHardwareChipOutline,
  IoWaterOutline,
  IoListOutline,
  IoBarChartOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoClose,
  IoFishOutline,
  IoTimeOutline,
  IoBookOutline,
  IoChevronDownOutline,
  IoShieldCheckmarkOutline
} from "react-icons/io5";
import Logo from "../assets/aman-logo-dark.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isFeedingOpen, setIsFeedingOpen] = useState(false); // State for submenu toggle

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-blue-700 text-white flex flex-col transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:w-[300px] w-[250px] z-50 shadow-lg`}
    >
      {/* Logo & Close Button */}
      <div className="p-5 flex items-center justify-between">
        <img src={Logo} alt="Logo" className="h-16" />
        <button className="lg:hidden text-white bg-transparent" onClick={toggleSidebar}>
          <IoClose size={24} />
        </button>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col">
          {[
            { to: "device-overview", label: "Overview", Icon: IoHomeOutline },
            { to: "manage-devices", label: "Device Management", Icon: IoHardwareChipOutline },
            { to: "water-parameters", label: "Water Parameters", Icon: IoWaterOutline },
            { to: "job-queue", label: "Job Queue", Icon: IoListOutline },
            { to: "analytics", label: "Analytics & Reports", Icon: IoBarChartOutline },
            { to: "notifications", label: "Notifications & Alerts", Icon: IoNotificationsOutline },
            { to: "fish-health-checker", label: "Fish Health Checker", Icon: IoFishOutline },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3 transition-all duration-200 ${
                  isActive ? "bg-white text-black font-bold" : "hover:bg-blue-800 text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Feeding Overview with Clickable Submenu */}
          <div className="cursor-pointer">
            <button
              className="w-full flex items-center justify-between px-6 py-3 hover:bg-blue-800"
              onClick={() => setIsFeedingOpen(!isFeedingOpen)}
            >
              <div className="flex items-center space-x-3">
                <IoFishOutline size={20} />
                <span>Feeding Overview</span>
              </div>
              <IoChevronDownOutline size={18} className={`transform ${isFeedingOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Submenu - Only visible when clicked */}
            {isFeedingOpen && (
              <div className="bg-blue-800 w-full rounded-md shadow-lg">
                <NavLink
                  to="feeding-schedule"
                  className="block px-6 py-3 hover:bg-blue-900 text-white flex items-center space-x-3"
                >
                  <IoTimeOutline size={18} />
                  <span>Feeding Schedule</span>
                </NavLink>
                <NavLink
                  to="feeding-history"
                  className="block px-6 py-3 hover:bg-blue-900 text-white flex items-center space-x-3"
                >
                  <IoBookOutline size={18} />
                  <span>Feeding History</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Footer Links - Non-Scrollable */}
      <div className="bg-blue-900 p-4">
        <NavLink
          to="settings"
          className="flex items-center space-x-3 px-6 py-3 transition-all duration-200 hover:bg-blue-800 text-white"
        >
          <IoSettingsOutline size={20} />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full text-left px-6 py-3 transition-all duration-200 hover:bg-red-600 text-white"
        >
          <IoLogOutOutline size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
