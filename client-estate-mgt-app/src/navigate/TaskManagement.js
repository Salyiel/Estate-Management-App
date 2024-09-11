import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Clean common areas', status: 'Pending' },
    { id: 2, name: 'Assist manager with meeting', status: 'Completed' },
  ]);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
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
          <h2>Task Management</h2>
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className="task-item">
                <p><strong>Task:</strong> {task.name}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <button onClick={() => updateTaskStatus(task.id, 'Completed')}>
                  Mark as Completed
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
