import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import 'bootstrap/dist/css/bootstrap.min.css';

const DrawerNav = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  // Auto-close drawer when route changes
  useEffect(() => {
    closeDrawer();
  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Button (Mobile) */}
      <button onClick={toggleDrawer} className="btn btn-dark position-fixed top-0 start-0 m-3 d-md-none">
        <IoMenu size={28} />
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`position-fixed top-0 start-0 h-100 bg-dark text-white w-75 transition-transform ${isOpen ? "translate-0" : "translate-n100"} d-md-block d-none shadow-lg`}
        style={{ zIndex: 1050 }}
      >
        {/* Close Button (Mobile) */}
        <button onClick={closeDrawer} className="btn-close btn-close-white position-absolute top-0 end-0 m-3 d-md-none"></button>

        {/* Logo */}
        <h2 className="text-center py-4">{isAdmin ? "Admin Panel" : "User Panel"}</h2>

        {/* Navigation Links */}
        <nav className="nav flex-column">
          <Link to={isAdmin ? "/admin" : "/user"} className="nav-link text-white">
            Dashboard
          </Link>

          {isAdmin ? (
            <>
              <Link to="/admin/users" className="nav-link text-white">Users</Link>
              <Link to="/admin/devices" className="nav-link text-white">Devices</Link>
              <Link to="/admin/data" className="nav-link text-white">Data Management</Link>
              <Link to="/admin/settings" className="nav-link text-white">Terminal Settings</Link>
            </>
          ) : (
            <>
              <Link to="/user/system-management" className="nav-link text-white">System Management</Link>
              <Link to="/user/local-data" className="nav-link text-white">Local Data</Link>
              <Link to="/user/alerts" className="nav-link text-white">Alerts & Notifications</Link>
              <Link to="/user/settings" className="nav-link text-white">User Settings</Link>
            </>
          )}

          {/* Logout */}
          <Link to="/" className="nav-link text-white bg-danger text-center mt-auto">Logout</Link>
        </nav>
      </div>

      {/* Overlay (Closes drawer when clicked outside) */}
      {isOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none" onClick={closeDrawer}></div>}
    </>
  );
};

export default DrawerNav;
