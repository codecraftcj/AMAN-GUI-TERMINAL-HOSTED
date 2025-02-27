import React from "react";
import { IoMenu, IoSearchOutline, IoNotificationsOutline } from "react-icons/io5";
import Logo from "../assets/aman-logo-dark.png";

const Header = ({ toggleSidebar }) => {
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
        <button className="p-2 bg-transparent">
          <IoNotificationsOutline size={24} className="text-black" />
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">U</div>
      </div>
    </header>
  );
};

export default Header;
