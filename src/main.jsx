import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DeviceOverview from './components/DeviceOverview.jsx';
import ManageDevices from './pages/ManageDevices.jsx';
import JobQueue from './pages/JobQueue.jsx';
import WaterParameters from './pages/WaterParameters.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';
import FishHealthChecker from './pages/FishHealthChecker.jsx';
import Analytics from './pages/Analytics.jsx';
import FeedingHistory from './pages/FeedingHistory.jsx';
import FeedingSchedule from './pages/FeedingSchedule.jsx';
import Development from './pages/Development.jsx';
import OldDev from './pages/Development_old.jsx';
const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> }, // Login Page

  {
    path: "/user",
    element: <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>,
    children: [
      { path: "device-overview", element: <DeviceOverview /> },
      // { path: "water-parameters", element: <WaterParameters/> },
      { path: "manage-devices", element: <ManageDevices/> },
      // { path: "job-queue", element: <JobQueue /> },
      { path: "notifications", element: <Notifications /> },
      { path: "settings", element: <Settings />},
      // { path: "feeding-history",element : <FeedingHistory />},
      // { path: "feeding-schedule",element : <FeedingSchedule/>},
      { path: "fish-health-checker",element : <FishHealthChecker />},
      { path: "analytics",element : <Analytics />},
      // { path: "development",element : <ManageDevices/>}

    ],
  },

  {
    path: "/admin",
    element: <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>,
    children:[
      {
        path:"manage-users", element: <ManageUsers/>,
      },
      {
        path:"manage-devices", element: <ManageDevices/>,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
