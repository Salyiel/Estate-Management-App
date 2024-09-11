import React from 'react';
import '../styles/Dashboards.css';
import { Link } from 'react-router-dom';


const ManagerDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li><Link to="/manager">Dashboard</Link></li>
          <li><Link to="/tenant-management">Tenant Management</Link></li>
          <li><Link to="/staff-management">Staff Management</Link></li>
          <li><Link to="/maintenance-management">Maintenance Management</Link></li>
          <li><Link to="/manager-reports">Reports</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Comprehensive Dashboard Section */}
        <div className="section">
          <h2>Comprehensive Dashboard</h2>
          <p><strong>Total Tenants:</strong> 50</p>
          <p><strong>Staff Members:</strong> 10</p>
          <p><strong>Open Maintenance Requests:</strong> 5</p>
        </div>

        {/* Tenant Management Section */}
        <div className="section">
          <h2>Tenant Management</h2>
          <table>
            <thead>
              <tr>
                <th>House No.</th>
                <th>Tenant</th>
                <th>Email</th>
                <th>Billing History</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>101</td>
                <td>John Doe</td>
                <td>john.doe@example.com</td>
                <td>$1200</td>
              </tr>
              <tr>
                <td>102</td>
                <td>Jane Smith</td>
                <td>jane.smith@example.com</td>
                <td>$1300</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Staff Management Section */}
        <div className="section">
          <h2>Staff Management</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Staff</th>
                <th>Shift</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Michael Johnson</td>
                <td>9:00 AM - 5:00 PM</td>
                <td>8 hours</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Emily Davis</td>
                <td>10:00 AM - 6:00 PM</td>
                <td>8 hours</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Maintenance Management Section */}
        <div className="section">
          <h2>Maintenance Management</h2>
          <p><strong>Request:</strong> Fix leaking faucet</p>
          <p><strong>Status:</strong> In Progress</p>
        </div>

        {/* Reports Section */}
        <div className="section">
          <h2>Reports</h2>
          <button className="report-btn">Generate Report</button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
