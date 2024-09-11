import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const ManagerReports = () => {
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
          <h2>Reports</h2>
          <button className="checkin-btn">Generate Report</button>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
