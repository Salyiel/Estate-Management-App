import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import SignOutButton from '../components/SignOutButton';

const ManagerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch feedbacks from the backend when the component loads
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/feedbacks'); // Assuming this is your endpoint
        setFeedbacks(response.data);
      } catch (err) {
        setError('Failed to load feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

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
      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li><Link to="/manager">Dashboard</Link></li>
          <li><Link to="/tenant-management">Tenant Management</Link></li>
          <li><Link to="/staff-management">Staff Management</Link></li>
          <li><Link to="/maintenance-management">Maintenance Management</Link></li>
          <li><Link to="/manager-feedback">Feedback</Link></li>
          <li><Link to="/manager-reports">Reports</Link></li>
          <li><SignOutButton /></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Feedbacks</h2>
          {loading && <p>Loading feedbacks...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && feedbacks.length === 0 && <p>No feedbacks available.</p>}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Feedback</th>
                <th>Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(feedback => (
                <tr key={feedback.id}>
                  <td>{feedback.id}</td>
                  <td>{feedback.user_name}</td>
                  <td>{feedback.feedback}</td>
                  <td>{new Date(feedback.date_submitted).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerFeedback;
