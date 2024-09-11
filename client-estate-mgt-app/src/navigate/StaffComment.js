import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CommentsFeedbacks = () => {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", feedback);
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsFeedbacks;
