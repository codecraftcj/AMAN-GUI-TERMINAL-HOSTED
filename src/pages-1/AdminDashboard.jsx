import React from "react";
import { Outlet } from "react-router-dom";
import DrawerNav from "../components/DrawerNav";

const AdminDashboard = () => (
  <div className="d-flex">
    <DrawerNav isAdmin={true} />
    <div className="ms-md-5 p-4 w-100">
      <h1 className="text-white mb-4">Admin Dashboard</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3">
            <button className="btn btn-primary w-100">Manage Users</button>
          </div>
          <div className="col-md-6 mb-3">
            <button className="btn btn-secondary w-100">Manage Devices</button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  </div>
);

export default AdminDashboard;
