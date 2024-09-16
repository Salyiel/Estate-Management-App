import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import SignOutButton from '../components/SignOutButton';

const MaintenanceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/all-tenant-requests'); // Adjust the URL to match your API endpoint
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="loading-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="house-icon">
          <path d="M12 3l10 9h-3v9h-6v-6h-2v6H5v-9H2l10-9z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/manager">Dashboard</Link></li>
          <li><Link to="/tenant-management">Tenant Management</Link></li>
          <li><Link to="/staff-management">Staff Management</Link></li>
          <li><Link to="/maintenance-management">Maintenance Management</Link></li>
          <li><Link to="/manager-feedback">Feedback</Link></li>
          <li><Link to="/manager-reports">Reports</Link></li>
          <li><SignOutButton /></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Maintenance Management</h2>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Tenant</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.user_name}</td>
                  <td>{request.body}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;
