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
  IoPersonOutline,
} from "react-icons/io5";
import Logo from "../assets/aman-logo-dark.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth(); // Access logout function
  const navigate = useNavigate(); // Navigation hook
  
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
        <img src={Logo} alt="Logo" className="h-20" />
        <button className="lg:hidden text-white bg-transparent" onClick={toggleSidebar}>
          <IoClose size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        {[
          { to: "manage-users", label: "User Management", Icon: IoPersonOutline },
          { to: "manage-devices", label: "Device Management", Icon: IoHardwareChipOutline },
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
      </nav>

      {/* Footer Links */}
      <div className="bg-blue-900 p-4">
        <NavLink
          to="/settings"
          className="flex items-center space-x-3 px-6 py-3 transition-all duration-200 hover:bg-blue-800 text-white"
        >
          <IoSettingsOutline size={20} />
          <span>Settings</span>
        </NavLink>

        {/* Logout Button */}
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
