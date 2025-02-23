import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SystemManagement from "./components/SystemManagement";
import LocalData from "./components/LocalData";
import Alerts from "./components/Alerts";
import UserSettings from "./components/UserSettings";
import AdminSystemOverview from "./components/AdminSystemOverview";
import DataManagement from "./components/DataManagement";
import TerminalSettings from "./components/TerminalSettings";
import LoadingScreen from "./components/LoadingScreen";
import DeviceOverview from "./components/DeviceOverview";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Router>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* User Routes */}
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/system-management" element={<SystemManagement />} />
          <Route path="/user/local-data" element={<LocalData />} />
          <Route path="/user/alerts" element={<Alerts />} />
          <Route path="/user/settings" element={<UserSettings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminSystemOverview />} />
          <Route path="/admin/devices" element={<DeviceOverview />} />
          <Route path="/admin/data" element={<DataManagement />} />
          <Route path="/admin/settings" element={<TerminalSettings />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
