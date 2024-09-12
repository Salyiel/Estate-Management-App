import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your server URL

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Rent is due on the 1st of this month." },
    { id: 2, message: "Your electricity bill is due on the 15th." },
  ]);

  useEffect(() => {
    // Listen for 'notification' events from the server
    socket.on('notification', (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ]);
    });

    // Clean up on component unmount
    return () => {
      socket.off('notification');
    };
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
        <div className="card">
          <h2>Notifications</h2>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="mb-2">
                <span dangerouslySetInnerHTML={{ __html: notification.message }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;