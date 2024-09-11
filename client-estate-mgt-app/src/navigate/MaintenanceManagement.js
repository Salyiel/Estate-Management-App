import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const MaintenanceManagement = () => {
  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/manager">Dashboard</Link></li>
          <li><Link to="/tenant-management">Tenant Management</Link></li>
          <li><Link to="/staff-management">Staff Management</Link></li>
          <li><Link to="/maintenance-management">Maintenance Management</Link></li>
          <li><Link to="/manager-reports">Reports</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Maintenance Management</h2>
          <p><strong>Request:</strong> Fix leaking faucet</p>
          <p><strong>Status:</strong> In Progress</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;
