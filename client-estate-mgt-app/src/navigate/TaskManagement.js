import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Pages.css';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
          }
        });
        setTasks(response.data);
      } catch (error) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
        }
      });
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      setError('Failed to update task status');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
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
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Task Management</h2>
          {error && <p className="text-red-500">{error}</p>}
          <ul className="task-list">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <li key={task.id} className="task-item">
                  <p><strong>Task:</strong> {task.name}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Completed')}
                      className="py-2 px-4 bg-green-500 text-white rounded"
                    >
                      Mark as Completed
                    </button>
                  )}
                </li>
              ))
            ) : (
              <li>No tasks available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;