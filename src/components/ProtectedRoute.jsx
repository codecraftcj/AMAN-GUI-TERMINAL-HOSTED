import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return user.role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/user/device-overview" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
