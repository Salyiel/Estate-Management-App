import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import axios from 'axios';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('/tenants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you're storing the JWT token in localStorage
          }
        });
        setTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };

    fetchTenants();
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
              {tenants.length > 0 ? (
                tenants.map(tenant => (
                  <tr key={tenant.id}>
                    <td>{tenant.name}</td>
                    <td>{tenant.email}</td>
                    <td>${tenant.billingHistory}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No tenants found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;