import React from 'react';
import '../styles/TenantDashboard.css';
import { Link } from 'react-router-dom';

const TenantDashboard = () => {
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
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
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
              <tr>
                <td>2023-09-01</td>
                <td>Rent</td>
                <td>$1200</td>
              </tr>
              <tr>
                <td>2023-09-15</td>
                <td>Electricity</td>
                <td>$150</td>
              </tr>
              <tr>
                <td>2023-09-20</td>
                <td>Wi-Fi</td>
                <td>$50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
