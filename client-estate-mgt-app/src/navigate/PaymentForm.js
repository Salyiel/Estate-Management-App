import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentType, setPaymentType] = useState("rent"); // Default to "rent"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/payments', {
        amount,
        date,
        paymentType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // Add JWT token if required
        }
      });

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
          <li><Link to="/notification">Notifications</Link></li>
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