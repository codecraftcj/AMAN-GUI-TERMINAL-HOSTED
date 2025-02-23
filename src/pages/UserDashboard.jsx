import React from "react";
import { Outlet } from "react-router-dom";
import DrawerNav from "../components/DrawerNav";
import Header from "../components/Header"; // Import the Header

const UserDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar Drawer */}
        <DrawerNav />
        <Header />
        {/* Main Content */}
        <div className="ml-0 md:ml-64 p-8 w-full transition-all duration-300">
        <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
