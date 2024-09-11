import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const StaffManagement = () => {
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
          <h2>Staff Management</h2>
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Shift</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Michael Johnson</td>
                <td>9:00 AM - 5:00 PM</td>
                <td>8 hours</td>
              </tr>
              <tr>
                <td>Emily Davis</td>
                <td>10:00 AM - 6:00 PM</td>
                <td>8 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
