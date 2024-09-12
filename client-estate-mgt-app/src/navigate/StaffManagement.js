import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Pages.css';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('/api/staff', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
          }
        });
        setStaff(response.data);
      } catch (error) {
        setError('Failed to fetch staff data');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
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
          <li><Link to="/manager-reports">Reports</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="card">
          <h2>Staff Management</h2>
          {error && <p className="text-red-500">{error}</p>}
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Shift</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {staff.length > 0 ? (
                staff.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td>{staffMember.name}</td>
                    <td>{staffMember.shift}</td>
                    <td>{staffMember.hoursWorked}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No staff data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;