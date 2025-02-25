import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import DeviceOverview from './components/DeviceOverview.jsx';
import DeviceManagement from './components/DeviceManagement.jsx'
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/development", element: <UserDashboard /> }, //dito pre
  {
    path: "/",
    element: <ProtectedRoute />, // Ensures user is logged in
    children: [
      {
        path: "farmer",
        element: <ProtectedRoute role="user" />,
        children: [
          { path: "", element: <UserDashboard /> },
          { path: "device-overview", element: <DeviceOverview /> },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoute role="admin" />,
        children: [
          { path: "", element: <AdminDashboard /> },

        ],
      },
    ],
  },
  { path: "/user-dashboard", element: <UserDashboard /> }, //dito pre
  { path: "/device-overview", element: <DeviceOverview /> },
  { path: "/notifications", element: <UserDashboard /> }, 
  { path: "/manage-devices", element: <DeviceManagement /> },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
