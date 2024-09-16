import React, { useEffect, useState } from 'react';
import '../styles/TenantDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignOutButton from './SignOutButton';

const TenantDashboard = () => {
  const [tenantInfo, setTenantInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);


  useEffect(() => {
    const fetchTenantData = async () => {
      const userId = localStorage.getItem("user_id");

      console.log("Retrieved user_id:", userId); // Debugging line

      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const tenantResponse = await axios.get('http://localhost:5555/tenants', {
          params: { user_id: userId }
        });
        console.log('Tenant data:', tenantResponse.data); // Debugging line
        setTenantInfo(tenantResponse.data);

        // Check for unread notifications
        const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
          params: { user_id: userId }
        });
        setHasUnreadNotifications(notificationsResponse.data.length > 0);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        setError('Failed to load tenant details');
        setLoading(false);
      }
    };

    fetchTenantData();
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
  
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/tenant">Dashboard</Link></li>
          <li><Link to="/payment">Payments</Link></li>
          <li><Link to="/request">Requests</Link></li>
          <li><Link to="/comment">Comments & Feedbacks</Link></li>
          <li>
            <Link to="/notification">
              Notifications {hasUnreadNotifications && <span className="notification-icon">🔔</span>}
            </Link>
          </li>
          <li><SignOutButton /></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Personal Information */}
        <div className="card">
          <h2>Personal Information</h2>
          <p><strong>Name:</strong> {tenantInfo.name || 'Loading...'}</p>
          <p><strong>Email:</strong> {tenantInfo.email || 'Loading...'}</p>
          <p><strong>Phone:</strong> {tenantInfo.phone || 'Loading...'}</p>
        </div>

        {/* Billing Details */}
        <div className="card billing-details">
          <h2>Billing Details</h2>
          <p><strong>Rent:</strong> $1200 (Due: 1st of every month)</p>
          <p><strong>Electricity:</strong> $150 (Due: 15th of every month)</p>
          <p><strong>Wi-Fi:</strong> $50 (Due: 20th of every month)</p>
        </div>

        {/* Payment History */}
        <div className="card">
          <h2>Payment History</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tenantInfo.payment_history && tenantInfo.payment_history.length > 0 ? (
                tenantInfo.payment_history.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.date}</td>
                    <td>{payment.description}</td>
                    <td>${payment.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No payment history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
