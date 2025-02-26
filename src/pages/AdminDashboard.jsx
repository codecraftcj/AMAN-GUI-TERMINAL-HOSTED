import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Header from "../components/Header";
import DeviceOverview from "../components/DeviceOverview";

const AdminDashboard = () => {
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
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content - Pushes Right When Sidebar is Open */}
        <div className={`pt-20 transition-all duration-300 w-full ${sidebarOpen ? "ml-[250px] lg:ml-[280px]" : "ml-0 lg:ml-[280px]"}`}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
