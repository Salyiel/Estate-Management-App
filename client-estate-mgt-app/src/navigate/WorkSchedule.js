import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import axios from 'axios';

const WorkSchedule = () => {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('/api/work-schedule', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // JWT token from localStorage
          }
        });
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching work schedule:', error);
      }
    };

    fetchSchedule();
  }, []);

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
          <h2>Work Schedule</h2>
          {schedule ? (
            <div className="schedule-details">
              <p><strong>Date:</strong> {schedule.date}</p>
              <p><strong>Shift:</strong> {schedule.shift}</p>
            </div>
          ) : (
            <p>Loading work schedule...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkSchedule;