import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignOutButton from '../components/SignOutButton';

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentType, setPaymentType] = useState("rent"); // Default to "rent"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const fetchNotifications = async () => {
    const userId = localStorage.getItem('user_id');
    
    try {
      // Check for unread notifications
      const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
        params: { user_id: userId }
      });
      console.log("Notifications Response:", notificationsResponse.data);
      setHasUnreadNotifications(notificationsResponse.data.length > 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Optionally, set error state for notifications
      setError('Failed to load notifications');
    }
  };

  fetchNotifications()

  const handlePayment = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id'); // Retrieve user ID from local storage
    console.log("Retrieved user_id:", userId); // Debugging line
    
    try {
      const response = await axios.post('/payments', {
        userId, // Include userId in the request payload
        amount,
        date,
        paymentType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
        }
      });

      // Check for unread notifications
      const notificationsResponse = await axios.get('http://localhost:5555/notifications/unread', {
        params: { user_id: userId }
      });
      console.log("Notifications Response:", notificationsResponse.data);
      setHasUnreadNotifications(notificationsResponse.data.length > 0);

      // Handle the response, e.g., show a success message or redirect
      console.log("Payment Response:", response.data);
      setSuccess('Payment processed successfully');
      setError(''); // Clear any previous errors
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Payment Error:", error);
      setError('Failed to process payment');
      setSuccess(''); // Clear any previous success messages
    }
  };

  return (
    <div className="container">
      <nav className="sidebar">
        <ul>
          <li><Link to="/tenant">Dashboard</Link></li>
          <li><Link to="/payment">Payments</Link></li>
          <li><Link to="/request">Requests</Link></li>
          <li><Link to="/comment">Comments & Feedbacks</Link></li>
          <li>
            <Link to="/notification">
              Notifications {hasUnreadNotifications && <span className="notification-icon">🔔</span>}
            </Link>
          </li>
          <li><SignOutButton /></li>
        </ul>
      </nav>
      <div className="main-content">
        <div className="card">
          <h2>Payments</h2>
          <form onSubmit={handlePayment}>
            <label htmlFor="paymentType" className="block mb-2">Payment Type</label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="rent">Rent</option>
              <option value="electricity">Electricity</option>
              <option value="wifi">WiFi</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Due Date"
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded">
              Pay Now
            </button>
            {success && <p className="text-green-500 mt-2">{success}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
