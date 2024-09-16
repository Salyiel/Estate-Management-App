import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Pages.css';
import SignOutButton from '../components/SignOutButton';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');

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
        console.error('Error fetching tasks', error);
        setError('Failed to fetch tasks');
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
        setError('Failed to fetch pending requests');
        setLoadingRequests(false);
      }
    };

    fetchData();
    fetchPendingRequests();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      setError('Failed to update task status');
    }
  };

  const updateRequestStatus = async (requestId) => {
    try {
      await axios.patch(`/api/tenant-requests/${requestId}`, { status: 'Completed' });
      setPendingRequests(pendingRequests.map(request =>
        request.id === requestId ? { ...request, status: 'Completed' } : request
      ));
    } catch (error) {
      setError('Failed to update request status');
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
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
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
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Task Management Section */}
        <div className="card">
          <h2>Task Management</h2>
          {error && <p className="text-red-500">{error}</p>}
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className="task">
                <p><strong>Task:</strong> {task.name}</p>
                <p><strong>Type:</strong> {task.is_primary ? 'Primary' : 'Maintenance Request'}</p>
                {task.is_primary ? null : (
                  <>
                    <p><strong>Status:</strong> {task.status}</p>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Completed')}
                      className="py-2 px-4 bg-green-500 text-white rounded"
                    >
                      Mark as Completed
                    </button>
                  </>
                )}
                {task.request && (
                  <div>
                    <p><strong>Request Status:</strong> {task.request.status}</p>
                    <p><strong>Request Details:</strong> {task.request.body}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>

        {/* Pending Tenant Requests Section */}
        <div className="card">
          <h2>Pending Tenant Requests</h2>
          {pendingRequests.length > 0 ? (
            pendingRequests.map(request => (
              <div key={request.id} className="request">
                <p><strong>{request.user_name}</strong>: {request.body} <br></br><strong>Status</strong>: {request.status}</p>
                {request.status !== 'Completed' && (
                  <button
                    onClick={() => updateRequestStatus(request.id)}
                    className="py-2 px-4 bg-green-500 text-white rounded"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No pending requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
