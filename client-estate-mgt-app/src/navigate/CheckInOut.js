import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Pages.css';
import SignOutButton from '../components/SignOutButton';

const CheckInOut = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState(''); // State for feedback messages
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const fetchStatusAndHistory = async () => {
      try {
        const userId = localStorage.getItem('user_id');

        // Fetch current check-in/check-out status
        const statusResponse = await axios.get('/api/check-in-status', { params: { user_id: userId } });
        setCheckedIn(statusResponse.data.checkedIn);
        setCheckedOut(statusResponse.data.checkedOut);

        // Check for unread notifications
        const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
          params: { user_id: userId }
        });
        setHasUnreadNotifications(notificationsResponse.data.length > 0);

        // Fetch check-in/check-out history
        const historyResponse = await axios.get('/api/check-in-out-history', { params: { user_id: userId } });
        setHistory(historyResponse.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchStatusAndHistory();
  }, []);

  const handleCheckIn = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const checkedInAt = new Date().toISOString(); // This will be in ISO 8601 format including 'Z'

      console.log({ user_id: userId, checked_in_at: checkedInAt });

      await axios.post('/api/check-in', { user_id: userId, checked_in_at: checkedInAt });
      setMessage('You are checked in'); // Set success message
      setCheckedIn(true); // Update check-in status
      setCheckedOut(false); // Ensure checkedOut is false
    } catch (err) {
      console.error('Error checking in:', err);
      setMessage('Error checking in'); // Set error message
    }
  };

  const handleCheckOut = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const checkedOutAt = new Date().toISOString(); // This will be in ISO 8601 format including 'Z'

      console.log({ user_id: userId, checked_out_at: checkedOutAt });

      await axios.post('/api/check-out', { user_id: userId, checked_out_at: checkedOutAt });
      setMessage('You are checked out'); // Set success message
      setCheckedOut(true); // Update check-out status
      setCheckedIn(false); // Ensure checkedIn is false
    } catch (err) {
      console.error('Error checking out:', err);
      setMessage('Error checking out'); // Set error message
    }
  };

  const formatDuration = (duration) => {
    if (!duration) {
      return 'No duration data';
    }
  
    // Split the duration into hours, minutes, seconds
    const [hours, minutes, seconds] = duration.split(':').map(Number);
  
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return 'Invalid duration';
    }
  
    // Convert the duration into total seconds
    const totalSeconds = (hours * 3600) + (minutes * 60) + Math.floor(seconds);
  
    // Format the duration based on its length
    if (totalSeconds < 60) {
      return `${totalSeconds} seconds`;
    } else if (totalSeconds < 3600) {
      const minutesPart = Math.floor(totalSeconds / 60);
      const secondsPart = totalSeconds % 60;
      return `${minutesPart} minutes ${secondsPart} seconds`;
    } else {
      const hoursPart = Math.floor(totalSeconds / 3600);
      const minutesPart = Math.floor((totalSeconds % 3600) / 60);
      return `${hoursPart} hours ${minutesPart} minutes`;
    }
  };
  
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
      <nav className="sidebar">
        <ul>
          <li><Link to="/staff">Dashboard</Link></li>
          <li><Link to="/work-schedule">Work Schedule</Link></li>
          <li><Link to="/status">Check-In/Check-Out</Link></li>
          <li><Link to="/tasks">Task Management</Link></li>
          <li><Link to="/comment">Comments</Link></li>
          <li>
            <Link to="/staff-notification">
              Notifications {hasUnreadNotifications && <span className="notification-icon">🔔</span>}
            </Link>
          </li>
          <li><SignOutButton /></li>
        </ul>
      </nav>

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
              {message && <p>{message}</p>} {/* Display feedback message */}
              <div className="history">
                <h3>Check-In/Check-Out History</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check-In Time</th>
                      <th>Check-Out Time</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, index) => (
                      <tr key={index}>
                        <td>{new Date(record.date_of_activity).toLocaleDateString()}</td>
                        <td>{new Date(record.checked_in_at).toLocaleTimeString()}</td>
                        <td>{new Date(record.checked_out_at).toLocaleTimeString()}</td>
                        <td>{formatDuration(record.time_worked)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;
