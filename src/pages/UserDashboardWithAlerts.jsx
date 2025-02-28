import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { fetchUnreadNotifications } from "../services/api";

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enableAlerts, setEnableAlerts] = useState(true); // Toggle alerts ON/OFF
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  
  useEffect(() => {
    if (!enableAlerts) return; // Stop fetching notifications if alerts are disabled

    const checkNotifications = async () => {
      try {
        const notifications = await fetchUnreadNotifications();
        
        if (notifications.length > 0) {
          setUnreadNotifications(notifications);
          // Show an alert for new unread notifications
          alert(`📢 You have ${notifications.length} new notification(s)!`);
        }
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    // Run every 10 seconds
    const interval = setInterval(checkNotifications, 10000);

    return () => clearInterval(interval);
  }, [enableAlerts]); // Re-run when `enableAlerts` changes

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

        {/* Main Content */}
        <div className={`lg:p-5 mt-20 transition-all duration-300 w-full ${sidebarOpen ? "ml-[250px] lg:ml-[280px]" : "ml-0 lg:ml-[280px]"}`}>
          {/* Alert Toggle */}
          <div className="flex items-center justify-end mb-4">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-semibold">Enable Alerts</span>
              <input 
                type="checkbox" 
                checked={enableAlerts} 
                onChange={() => setEnableAlerts(!enableAlerts)}
                className="hidden"
              />
              <div className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${enableAlerts ? "bg-green-500" : ""}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${enableAlerts ? "translate-x-5" : ""}`}></div>
              </div>
            </label>
          </div>

          {/* Display Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="bg-yellow-100 p-3 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold text-yellow-800">Unread Notifications</h3>
              <ul className="mt-2 text-yellow-700">
                {unreadNotifications.map((notif) => (
                  <li key={notif.id} className="mb-2">
                    <strong>{notif.message}</strong> - {notif.details}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
