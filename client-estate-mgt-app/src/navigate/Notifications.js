import React from 'react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const notifications = [
    { id: 1, message: "Rent is due on the 1st of this month." },
    { id: 2, message: "Your electricity bill is due on the 15th." },
    { id: 3, message: (
          <>
          "Your Wi-Fi has been paid. Click 
          <a href="/download link">here</a> to download receipt."
          </>
        ) 
   },
  ];

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
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;