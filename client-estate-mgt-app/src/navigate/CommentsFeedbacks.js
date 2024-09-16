import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignOutButton from '../components/SignOutButton';

const CommentsFeedbacks = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const fetchNotifications = async () => {
    const userId = localStorage.getItem('user_id');
    
    try {
      // Check for unread notifications
      const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
        params: { user_id: userId }
      });
      console.log("Notifications Response:", notificationsResponse.data);
      setHasUnreadNotifications(notificationsResponse.data.length > 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Optionally, set error state for notifications
      setError('Failed to load notifications');
    }
  };

  fetchNotifications()

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    // Get user information from local storage
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');

    console.log("Retrieved user_id:", userId); // Debugging line
    console.log("Retrieved user_name:", userName); // Debugging lin

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

      // Check for unread notifications
      const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
        params: { user_id: userId }
      });
      setHasUnreadNotifications(notificationsResponse.data.length > 0);

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
