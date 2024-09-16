import React, { useState, useEffect } from 'react';
import '../styles/Dashboards.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignOutButton from './SignOutButton';

const StaffDashboard = () => {
  const [workSchedule, setWorkSchedule] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [message, setMessage] = useState(''); // State for feedback messages
  const [isCheckedIn, setIsCheckedIn] = useState(false); // State to track check-in status
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('/api/tenant-requests');
        setPendingRequests(response.data);
        setLoadingRequests(false);
      } catch (error) {
        console.error('Error fetching pending requests', error);
        setLoadingRequests(false);
      }
    };

    const fetchCheckInStatus = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const statusResponse = await axios.get('/api/check-in-status', { params: { user_id: userId } });
        setIsCheckedIn(statusResponse.data.checkedIn);
      } catch (error) {
        console.error('Error fetching check-in status', error);
      }
    };

    fetchData();
    fetchPendingRequests();
    fetchCheckInStatus(); // Fetch check-in status on component mount
  }, []);

  const handleCheckIn = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const checkedInAt = new Date().toISOString(); // This will be in ISO 8601 format including 'Z'

      console.log({ user_id: userId, checked_in_at: checkedInAt });

      await axios.post('/api/check-in', { user_id: userId, checked_in_at: checkedInAt });
      setMessage('You are checked in'); // Set success message
      setIsCheckedIn(true); // Update check-in status
    } catch (error) {
      console.error('Error checking in', error);
      setMessage('Error checking in'); // Set error message
    }
  };

  const handleCheckOut = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const checkedOutAt = new Date().toISOString(); // This will be in ISO 8601 format including 'Z'

      console.log({ user_id: userId, checked_out_at: checkedOutAt });

      await axios.post('/api/check-out', { user_id: userId, checked_out_at: checkedOutAt });
      setMessage('You are checked out'); // Set success message
      setIsCheckedIn(false); // Update check-in status
    } catch (error) {
      console.error('Error checking out', error);
      setMessage('Error checking out'); // Set error message
    }
  };

  if (loading || loadingRequests) {
    return (
      <div className="loading-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="house-icon">
          <path d="M12 3l10 9h-3v9h-6v-6h-2v6H5v-9H2l10-9z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li><Link to="/staff">Dashboard</Link></li>
          <li><Link to="/work-schedule">Work Schedule</Link></li>
          <li><Link to="/status">Check-In/Check-Out</Link></li>
          <li><Link to="/tasks">Task Management</Link></li>
          <li><Link to="/staff-comment">Comments</Link></li>
          <li>
            <Link to="/staff-notification">
              Notifications {hasUnreadNotifications && <span className="notification-icon">🔔</span>}
            </Link>
          </li>
          <li><SignOutButton /></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Work Schedule Section */}
        <div className="section">
          <h2>Work Schedule</h2>
          {workSchedule ? (
            <div className="work-schedule">
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

        {/* Check-In/Check-Out Section */}
        <div className="section">
          <h2>Check-In/Check-Out</h2>
          <button className="checkin-btn" onClick={handleCheckIn} disabled={isCheckedIn}>
            Check-In
          </button>
          <button className="checkout-btn" onClick={handleCheckOut} disabled={!isCheckedIn}>
            Check-Out
          </button>
          {message && <p>{message}</p>} {/* Display feedback message */}
        </div>

        {/* Task Management Section */}
        <div className="section">
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

        {/* Pending Tenant Requests Section */}
        <div className="section">
          <h2>Pending Tenant Requests</h2>
          {pendingRequests.length > 0 ? (
            pendingRequests.map(request => (
              <div key={request.id} className="request">
                <p><strong>{request.user_name}</strong>: {request.body} (Status: {request.status})</p>
              </div>
            ))
          ) : (
            <p>No pending requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
