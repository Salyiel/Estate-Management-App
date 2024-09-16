import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import SignOutButton from '../components/SignOutButton';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('/tenant-management-data');
        setTenants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setLoading(false);
      }
    };

    fetchTenants();
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
          <h2>Tenant Management</h2>
          <table>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Email</th>
                <th>Payments</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(tenant => (
                <tr key={tenant.id}>
                  <td>{tenant.name}</td>
                  <td>{tenant.email}</td>
                  <td>
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenant.payments.map((payment, index) => (
                          <tr key={index}>
                            <td>{payment.date}</td>
                            <td>${payment.amount}</td>
                            <td>{payment.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;
