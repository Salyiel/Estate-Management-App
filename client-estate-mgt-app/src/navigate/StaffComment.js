import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignOutButton from '../components/SignOutButton';

const CommentsFeedbacks = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Fetch unread notifications
  useEffect(() => {
    const checkUnreadNotifications = async () => {
      const userId = localStorage.getItem('user_id'); // Get user ID from local storage

      if (userId) {
        try {
          const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
            params: { user_id: userId }
          });
          setHasUnreadNotifications(notificationsResponse.data.length > 0);
        } catch (err) {
          console.error("Error checking unread notifications:", err);
        }
      }
    };

    checkUnreadNotifications();
  }, []); // Empty dependency array means this will run once when the component mounts

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    // Get user information from local storage
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');

    console.log("Retrieved user_id:", userId); // Debugging line
    console.log("Retrieved user_name:", userName); // Debugging line

    try {
      const response = await axios.post(
        '/api/feedback',
        { feedback, user_id: userId, user_name: userName },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(response.data.message);
      setFeedback(""); // Clear feedback input
      setError(""); // Clear any previous error
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setMessage(""); // Clear any previous success message
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
          <li><Link to="/staff-comment">Comments</Link></li>
          <li>
            <Link to="/staff-notification">
              Notifications {hasUnreadNotifications && <span className="notification-icon">🔔</span>}
            </Link>
          </li>
          <li><SignOutButton /></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Comments & Feedbacks</h2>
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your comments or feedback"
              className="w-full p-2 mb-2 border rounded"
              rows="5"
            />
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded">
              Submit Feedback
            </button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CommentsFeedbacks;
