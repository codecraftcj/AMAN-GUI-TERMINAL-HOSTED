import React from "react";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-3">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/logo.png" alt="AMAN Logo" className="h-10 w-auto" />
      </div>

      {/* Search Bar */}
      <div className="relative flex-grow mx-6">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notification & Profile */}
      <div className="flex items-center space-x-4">
        <button className="relative">
          <FaBell className="text-blue-600 text-xl" />
        </button>
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-700 font-semibold">U</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
