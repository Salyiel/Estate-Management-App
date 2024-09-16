import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';
import SignOutButton from '../components/SignOutButton';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('/staff-list'); // Adjust the URL to match your API endpoint
        setStaff(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching staff:', error);
        setLoading(false);
      }
    };

    fetchStaff();
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
          <h2>Staff Management</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Staff</th>
                <th>Shift</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(member => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.shift}</td>
                  <td>{member.hoursWorked.toFixed(2)} hours</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
