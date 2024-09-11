import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboards.css';
import { CSVLink } from 'react-csv';

const ManagerReports = () => {
  // Sample data for tenants and staff
  const tenantData = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", billingHistory: "$1200" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", billingHistory: "$1300" }
  ];

  const staffData = [
    { id: 1, name: "Michael Johnson", shift: "9:00 AM - 5:00 PM", hoursWorked: "8 hours" },
    { id: 2, name: "Emily Davis", shift: "10:00 AM - 6:00 PM", hoursWorked: "8 hours" }
  ];

  // CSV headers and data for tenants and staff
  const tenantHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Billing History", key: "billingHistory" }
  ];

  const staffHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Shift", key: "shift" },
    { label: "Hours Worked", key: "hoursWorked" }
  ];

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/manager-dashboard">Comprehensive Dashboard</Link></li>
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

          {/* CSV Download Buttons */}
          <CSVLink
            data={tenantData}
            headers={tenantHeaders}
            filename="tenant_report.csv"
            className="checkin-btn"
          >
            Download Tenant Report
          </CSVLink>

          <CSVLink
            data={staffData}
            headers={staffHeaders}
            filename="staff_report.csv"
            className="checkin-btn"
            style={{ marginLeft: '10px' }}
          >
            Download Staff Report
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
