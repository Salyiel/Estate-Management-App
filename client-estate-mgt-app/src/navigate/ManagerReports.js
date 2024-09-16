import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Pages.css';
import SignOutButton from '../components/SignOutButton';

const ManagerReports = () => {
  const [notificationContent, setNotificationContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('everyone');
  const [specificRecipient, setSpecificRecipient] = useState('');
  const [users, setUsers] = useState([]); // Holds the list of users
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tenants and staff members on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const tenantsResponse = await axios.get('/tenants-list');
        const staffResponse = await axios.get('/staff-list');
        const allUsers = [
          ...tenantsResponse.data.map(tenant => ({ name: tenant.name, type: 'tenant' })),
          ...staffResponse.data.map(staff => ({ name: staff.name, type: 'staff' }))
        ];
        setUsers(allUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleNotificationContentChange = (e) => {
    setNotificationContent(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setSelectedRecipient(e.target.value);
    setSpecificRecipient(''); // Clear the specific recipient when switching to "everyone"
  };

  const handleSpecificRecipientChange = (e) => {
    setSpecificRecipient(e.target.value);
  };

  const sendNotification = async () => {
    setLoading(true);
    setError(null);

    try {
      const recipient = selectedRecipient === 'everyone' ? 'everyone' : specificRecipient;
      
      await axios.post('/api/send-notification', {
        content: notificationContent,
        recipient
      });
      alert('Notification sent successfully!');
      setNotificationContent('');
    } catch (err) {
      setError('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

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
          <h2>Send Notification</h2>
          <textarea
            rows="4"
            value={notificationContent}
            onChange={handleNotificationContentChange}
            placeholder="Enter notification content..."
          ></textarea>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
              <input
                type="radio"
                value="everyone"
                checked={selectedRecipient === 'everyone'}
                onChange={handleRecipientChange}
              />
              Everyone
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
              <input
                type="radio"
                value="specific"
                checked={selectedRecipient === 'specific'}
                onChange={handleRecipientChange}
              />
              Specific Person
            </label>
          </div>
          {selectedRecipient === 'specific' && (
            <select
              value={specificRecipient}
              onChange={handleSpecificRecipientChange}
              style={{ marginTop: '10px' }}
            >
              <option value="">Select a recipient</option>
              {users.map((user, index) => (
                <option key={index} value={user.name}>
                  {user.name} ({user.type})
                </option>
              ))}
            </select>
          )}
          <button className="checkin-btn" onClick={sendNotification} disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Sending Notification...' : 'Send Notification'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
