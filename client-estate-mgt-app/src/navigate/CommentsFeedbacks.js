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
