import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignOutButton from '../components/SignOutButton';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOlder, setShowOlder] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) return;

      try {
        // Check for unread notifications
        const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
          params: { user_id: userId }
        });
        setHasUnreadNotifications(notificationsResponse.data.length > 0);

        // Fetch unread notifications
        const response = await axios.get('http://localhost:5555/notifications/unread', {
          params: { user_id: userId }
        });
        setNotifications(response.data);

        // Mark notifications as read
        await axios.post('http://localhost:5555/notifications/mark_read', { user_id: userId });

        // Fetch all notifications
        const allResponse = await axios.get('http://localhost:5555/notifications/all', {
          params: { user_id: userId }
        });
        setAllNotifications(allResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    try {
      const response = await axios.get('http://localhost:5555/notifications/all', {
        params: { user_id: userId }
      });
      setAllNotifications(response.data);
      setShowOlder(true);
    } catch (error) {
      console.error('Error fetching all notifications:', error);
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

      <div className="main-content">
        <div className="card">
          <h2>Notifications</h2>
          {notifications.length === 0 ? (
            <div>
              <p>You are all caught up</p>
              <button onClick={fetchAllNotifications}>View Older Notifications</button>
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id} className="mb-2">
                  <span dangerouslySetInnerHTML={{ __html: notification.message }} />
                  <br />
                  <small>{new Date(notification.date_sent).toLocaleString()}</small> {/* Format and display date */}
                </li>
              ))}
            </ul>
          )}
          {showOlder && (
            <div>
              <h3>Older Notifications</h3>
              <ul>
                {allNotifications.map((notification) => (
                  <li key={notification.id} className="mb-2">
                    <span dangerouslySetInnerHTML={{ __html: notification.message }} />
                    <br />
                    <small>{new Date(notification.date_sent).toLocaleString()}</small> {/* Format and display date */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
