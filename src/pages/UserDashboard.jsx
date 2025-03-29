import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DeviceOverview from "../components/DeviceOverview";

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content - Pushes Right When Sidebar is Open */}
        <div className={`lg:p-5 mt-20 transition-all bg-gray-100  duration-300 w-full ${sidebarOpen ? "ml-[250px] lg:ml-[280px]" : "ml-0 lg:ml-[280px]"}`}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
