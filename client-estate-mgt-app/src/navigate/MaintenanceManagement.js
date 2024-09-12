import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import axios from 'axios';

const MaintenanceManagement = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Adjust if using different method for token storage
        
        const response = await axios.get('/api/maintenance', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setMaintenanceRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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

          {/* Loading and Error Handling */}
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}

          {/* Maintenance Requests */}
          <ul>
            {maintenanceRequests.map(request => (
              <li key={request.id}>
                <p><strong>Request:</strong> {request.description}</p>
                <p><strong>Status:</strong> {request.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;