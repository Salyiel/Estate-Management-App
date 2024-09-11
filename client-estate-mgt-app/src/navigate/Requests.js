import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Requests = () => {
  const [request, setRequest] = useState("");

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    console.log("Request Submitted:", request);
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
            <li><Link to="/notification">Notifications</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Requests</h2>
          <form onSubmit={handleRequestSubmit}>
            <textarea
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Enter your request"
              className="w-full p-2 mb-2 border rounded"
              rows="5"
            />
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Requests;
