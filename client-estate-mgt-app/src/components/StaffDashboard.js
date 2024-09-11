import React from 'react';
import '../styles/Dashboards.css';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li><Link to ="/staff">Dashboard</Link></li>
          <li><Link to ="/work-schedule">Work Schedule</Link></li>
          <li><Link to="/status">Check-In/Check-Out</Link></li>
          <li><Link to="/tasks">Task Management</Link></li>
          <li><Link to="/staff-comment">Comments</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Work Schedule Section */}
        <div className="section">
          <h2>Work Schedule</h2>
          <div className="work-schedule">
            <p><strong>Date:</strong> 2023-09-01</p>
            <p><strong>Shift:</strong> 9:00 AM - 5:00 PM</p>
          </div>
        </div>

        {/* Check-In/Check-Out Section */}
        <div className="section">
          <h2>Check-In/Check-Out</h2>
          <button className="checkin-btn">Check-In</button>
          <button className="checkout-btn">Check-Out</button>
        </div>

        {/* Task Management Section */}
        <div className="section">
          <h2>Task Management</h2>
          <p><strong>Task:</strong> Clean common areas</p>
          <p><strong>Status:</strong> Pending</p>
        </div>

        {/* Comments Section */}
        <div className="section">
          <h2>Comments Section</h2>
          <textarea className="comment-box" placeholder="Leave your comment..."></textarea>
          <button className="submit-btn">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
