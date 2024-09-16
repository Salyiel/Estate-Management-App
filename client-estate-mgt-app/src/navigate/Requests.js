import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignOutButton from '../components/SignOutButton';

const Requests = () => {
  const [request, setRequest] = useState("");
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const userId = localStorage.getItem('user_id');
  const userName = localStorage.getItem('user_name');

  console.log("Retrieved user_id:", userId); // Debugging line
  console.log("Retrieved user_name:", userName); // Debugging line

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`/requests/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
          }
        });

        // Check for unread notifications
        const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
          params: { user_id: userId }
        });
        console.log("Notifications Response:", notificationsResponse.data);
        setHasUnreadNotifications(notificationsResponse.data.length > 0);

        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError('Failed to load requests');
      }
    };

    fetchRequests();
  }, [userId]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/requests', {
        body: request,
        user_id: userId,
        user_name: userName
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
        }
      });

      setSuccess('Request submitted successfully');
      setError('');
      setRequest('');
      // Refresh the requests list
      const response = await axios.get(`/requests/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
        }
      });
      setRequests(response.data);
    } catch (error) {
      setError('Failed to submit request');
      setSuccess('');
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
          <div className="mt-4">
            <h3>Previous Requests</h3>
            {requests.length > 0 ? (
              <ul>
                {requests.map((req, index) => (
                  <li key={index} className="mb-2 p-2 border rounded">
                    <p><strong>Request:</strong> {req.body}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    <p><strong>Submitted by:</strong> {req.user_name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No requests found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
