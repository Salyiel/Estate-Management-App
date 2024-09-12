import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CommentsFeedbacks = () => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/comments', { body: feedback }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
        }
      });

      setSuccess('Feedback submitted successfully');
      setError(''); // Clear any previous errors
      setFeedback(''); // Clear the feedback textarea
    } catch (error) {
      setError('Failed to submit feedback');
      setSuccess(''); // Clear any previous success messages
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
          <li><Link to="/comment">Comments</Link></li>
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
            {success && <p className="text-green-500 mt-2">{success}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsFeedbacks;