import React, { useEffect, useState } from 'react';
import '../styles/Dashboards.css';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import SignOutButton from './SignOutButton';

const ManagerDashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [staff, setStaff] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const navigate = useNavigate(); // Create a navigate function
  
  const handleGenerateReportClick = () => {
      navigate('/manager-reports'); // Navigate to the /manager-reports route
    };

  // Fetch tenants
  useEffect(() => {
    axios.get('/tenants-list')
      .then(response => setTenants(response.data))
      .catch(error => console.error("There was an error fetching tenants!", error));
  }, []);

  // Fetch staff
  useEffect(() => {
    axios.get('/staff-list')
      .then(response => setStaff(response.data))
      .catch(error => console.error("There was an error fetching staff!", error));
  }, []);

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('/api/tenant-requests');
      setPendingRequests(response.data);
      setLoadingRequests(false);
    } catch (error) {
      console.error('Error fetching pending requests', error);
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);
  

  if (loadingRequests) {
    return (
      <div className="loading-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="house-icon">
          <path d="M12 3l10 9h-3v9h-6v-6h-2v6H5v-9H2l10-9z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li><Link to="/manager">Dashboard</Link></li>
          <li><Link to="/tenant-management">Tenant Management</Link></li>
          <li><Link to="/staff-management">Staff Management</Link></li>
          <li><Link to="/maintenance-management">Maintenance Management</Link></li>
          <li><Link to="/manager-feedback">Feedback</Link></li>
          <li><Link to="/manager-reports">Reports</Link></li>
          <li><SignOutButton /></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Comprehensive Dashboard Section */}
        <div className="section">
          <h2>Comprehensive Dashboard</h2>
          <p><strong>Total Tenants:</strong> {tenants.length}</p>
          <p><strong>Staff Members:</strong> {staff.length}</p>
          <p><strong>Open Maintenance Requests:</strong> {pendingRequests.length}</p>
        </div>

        {/* Tenant Management Section */}
        <div className="section">
          <h2>Tenant Management</h2>
          <table>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Email</th>
                <th>Recent Payment</th>
                <th>Bill</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => (
                <tr key={tenant.id}>
                  <td>{tenant.name}</td>
                  <td>{tenant.email}</td>
                  <td>${tenant.most_recent_payment}</td>
                  <td>{tenant.most_recent_bill}</td>
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
                  <td>{member.hoursWorked.toFixed(2)} hours</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Maintenance Management Section */}
        <div className="section">
          <h2>Maintenance Management</h2>
          {loadingRequests ? (
            <p>Loading pending requests...</p>
          ) : (
            <ul>
              {pendingRequests.map(request => (
                <li key={request.id}>
                  <p><strong>Request:</strong> {request.body}</p>
                  <p><strong>Status:</strong> {request.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reports Section */}
        <div className="section">
          <h2>Reports</h2>
          <button className="report-btn" onClick={handleGenerateReportClick}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
