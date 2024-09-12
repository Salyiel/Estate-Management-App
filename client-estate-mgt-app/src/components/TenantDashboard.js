import React, { useEffect, useState } from 'react';
import '../styles/TenantDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TenantDashboard = () => {
  const [tenantInfo, setTenantInfo] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    // Fetch tenant information and payment history from the backend
    const fetchTenantData = async () => {
      try {
        const tenantResponse = await axios.get('/api/tenant'); // Replace with the correct endpoint
        setTenantInfo(tenantResponse.data);

        const paymentResponse = await axios.get('/api/payments'); // Replace with the correct endpoint
        setPaymentHistory(paymentResponse.data);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      }
    };

    fetchTenantData();
  }, []);

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/tenant">Dashboard</Link></li>
          <li><Link to="/payment">Payments</Link></li>
          <li><Link to="/request">Requests</Link></li>
          <li><Link to="/comment">Comments & Feedbacks</Link></li>
          <li><Link to="/notification">Notifications</Link></li>
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
              {paymentHistory.length > 0 ? (
                paymentHistory.map(payment => (
                  <tr key={payment.id}>
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