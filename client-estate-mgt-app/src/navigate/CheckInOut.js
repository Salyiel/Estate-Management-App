import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const CheckInOut = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckIn = () => setCheckedIn(true);
  const handleCheckOut = () => setCheckedOut(true);

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
          <h2>Check-In/Check-Out</h2>
          <div className="checkin-status">
            {checkedIn && <p className="status-text">You are checked in</p>}
            {checkedOut && <p className="status-text">You are checked out</p>}
          </div>
          <div className="btn-group">
            <button className="checkin-btn" onClick={handleCheckIn}>
              Check-In
            </button>
            <button className="checkout-btn" onClick={handleCheckOut}>
              Check-Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;
