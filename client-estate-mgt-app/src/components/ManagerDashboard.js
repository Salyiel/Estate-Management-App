import React, { useEffect, useState } from 'react';
import '../styles/Dashboards.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManagerDashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantsResponse = await axios.get('/tenants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setTenants(tenantsResponse.data);

        const staffResponse = await axios.get('/staff', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setStaff(staffResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
          <p><strong>Total Tenants:</strong> {tenants.length}</p>
          <p><strong>Staff Members:</strong> {staff.length}</p>
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
              {tenants.map(tenant => (
                <tr key={tenant.id}>
                  <td>{tenant.houseNo}</td>
                  <td>{tenant.name}</td>
                  <td>{tenant.email}</td>
                  <td>{tenant.billingHistory}</td>
                </tr>
              ))}
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
              {staff.map(member => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.shift}</td>
                  <td>{member.hoursWorked}</td>
                </tr>
              ))}
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