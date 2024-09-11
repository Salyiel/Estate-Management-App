import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const TenantManagement = () => {
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
          <h2>Tenant Management</h2>
          <table>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Email</th>
                <th>Billing History</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john.doe@example.com</td>
                <td>$1200</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>jane.smith@example.com</td>
                <td>$1300</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;
