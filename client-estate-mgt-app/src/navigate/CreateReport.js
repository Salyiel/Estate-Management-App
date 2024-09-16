import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboards.css';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import SignOutButton from '../components/SignOutButton';

const ManagerReports = () => {
  const [tenantData, setTenantData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Adjust if using different method for token storage
        
        const tenantResponse = await axios.get('/tenants', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const staffResponse = await axios.get('/staff', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setTenantData(tenantResponse.data);
        setStaffData(staffResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <li><SignOutButton /></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Reports</h2>

          {/* Loading and Error Handling */}
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}

          {/* CSV Download Buttons */}
          <CSVLink
            data={tenantData}
            headers={tenantHeaders}
            filename="tenant_report.csv"
            className="checkin-btn"
            disabled={loading}
          >
            Download Tenant Report
          </CSVLink>

          <CSVLink
            data={staffData}
            headers={staffHeaders}
            filename="staff_report.csv"
            className="checkin-btn"
            style={{ marginLeft: '10px' }}
            disabled={loading}
          >
            Download Staff Report
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;