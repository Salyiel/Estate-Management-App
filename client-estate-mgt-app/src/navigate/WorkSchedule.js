import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import axios from 'axios';
import SignOutButton from '../components/SignOutButton';

const WorkSchedule = () => {
  const [workSchedule, setWorkSchedule] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const userId = localStorage.getItem('user_id');

        // Fetch work schedule
        const scheduleResponse = await axios.get(`/api/work-schedule/${userId}`);
        setWorkSchedule(scheduleResponse.data);

        // Fetch tasks
        const tasksResponse = await axios.get(`/api/tasks/${userId}`);
        const tasksData = tasksResponse.data;

        // Check for unread notifications
        const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
          params: { user_id: userId }
        });
        setHasUnreadNotifications(notificationsResponse.data.length > 0);

        // Fetch requests for each task
        const tasksWithRequestDetails = await Promise.all(
          tasksData.map(async (task) => {
            if (task.request_id) {
              const requestResponse = await axios.get(`/api/request/${task.request_id}`);
              return { ...task, request: requestResponse.data };
            }
            return task;
          })
        );

        setTasks(tasksWithRequestDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule and tasks', error);
        setLoading(false);
      }
    };

    fetchScheduleData();
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
          <li><Link to="/staff">Dashboard</Link></li>
          <li><Link to="/work-schedule">Work Schedule</Link></li>
          <li><Link to="/status">Check-In/Check-Out</Link></li>
          <li><Link to="/tasks">Task Management</Link></li>
          <li><Link to="/comment">Comments</Link></li>
          <li>
            <Link to="/staff-notification">
              Notifications {hasUnreadNotifications && <span className="notification-icon">🔔</span>}
            </Link>
          </li>
          <li><SignOutButton /></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Work Schedule</h2>
          {workSchedule ? (
            <div className="schedule-details">
              <p><strong>Date:</strong> {workSchedule.date}</p>
              <p><strong>Working Days:</strong> {workSchedule.working_days}</p>
              <p><strong>Off Days:</strong> {workSchedule.off_days}</p>
              <p><strong>Check-In Time:</strong> {workSchedule.check_in_time}</p>
              <p><strong>Check-Out Time:</strong> {workSchedule.check_out_time}</p>
            </div>
          ) : (
            <p>No work schedule available.</p>
          )}
        </div>

        {/* Task Management Section */}
        <div className="card">
          <h2>Task Management</h2>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className="task">
                <p><strong>Task:</strong> {task.name}</p>
                <p><strong>Type:</strong> {task.is_primary ? 'Primary' : 'Maintenance Request'}</p>
                {task.request && (
                  <div>
                    <p><strong>Request Status:</strong> {task.request.status}</p>
                    <p><strong>Request Details:</strong> {task.request.body}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No tasks assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkSchedule;
