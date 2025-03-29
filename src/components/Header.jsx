import React, { useState, useEffect } from "react";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import Logo from "../assets/aman-logo-dark.png";

const Header = ({ toggleSidebar }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="w-full bg-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40 shadow-md">
      {/* Left: Mobile Menu Button */}
      <div className="flex items-center space-x-3">
        <button className="bg-transparent lg:hidden p-2" onClick={toggleSidebar}>
          <IoMenu size={24} className="text-black" />
        </button>
        <img src={Logo} alt="AMAN Logo" className="h-10" />
      </div>

    

      {/* Right: Notifications & Profile */}
      <div className="flex items-center space-x-4">
      <span
          className={`px-3 py-1 text-xs font-medium rounded-lg ${
            isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
        <button className="p-2 bg-transparent">
          <IoNotificationsOutline size={24} className="text-black" />
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;
