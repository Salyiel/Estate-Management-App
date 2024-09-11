import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css'

const WorkSchedule = () => {
  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/staff">Dashboard</Link></li>
          <li><Link to="/work-schedule">Work Schedule</Link></li>
          <li><Link to="/status">Check-In/Check-Out</Link></li>
          <li><Link to="/tasks">Task Management</Link></li>
          <li><Link to="/comment">Comments</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Work Schedule</h2>
          <div className="schedule-details">
            <p><strong>Date:</strong> 2023-09-01</p>
            <p><strong>Shift:</strong> 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSchedule;
