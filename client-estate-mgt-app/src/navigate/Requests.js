import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Requests = () => {
  const [request, setRequest] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/requests', { body: request }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
        }
      });

      setSuccess('Request submitted successfully');
      setError(''); // Clear any previous errors
      setRequest(''); // Clear the request textarea
    } catch (error) {
      setError('Failed to submit request');
      setSuccess(''); // Clear any previous success messages
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
            {success && <p className="text-green-500 mt-2">{success}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Requests;