import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Assuming you are using axios for HTTP requests
import '../styles/Pages.css';

const CheckInOut = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current check-in/check-out status on component mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('/check-in-status', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setCheckedIn(response.data.checkedIn);
        setCheckedOut(response.data.checkedOut);
      } catch (err) {
        setError('Failed to fetch status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      await axios.post('/api/check-in', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setCheckedIn(true);
      setCheckedOut(false);
    } catch (err) {
      setError('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post('/api/check-out', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setCheckedOut(true);
      setCheckedIn(false);
    } catch (err) {
      setError('Failed to check out');
    }
  };

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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {error && <p className="error-text">{error}</p>}
              <div className="checkin-status">
                {checkedIn && <p className="status-text">You are checked in</p>}
                {checkedOut && <p className="status-text">You are checked out</p>}
                {!checkedIn && !checkedOut && <p className="status-text">You are not checked in or checked out</p>}
              </div>
              <div className="btn-group">
                <button className="checkin-btn" onClick={handleCheckIn} disabled={checkedIn}>
                  Check-In
                </button>
                <button className="checkout-btn" onClick={handleCheckOut} disabled={checkedOut}>
                  Check-Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;