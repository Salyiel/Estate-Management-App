import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentType, setPaymentType] = useState("rent"); // Default to "rent"

  const handlePayment = (e) => {
    e.preventDefault();
    console.log("Payment Type:", paymentType, "Amount:", amount, "Due Date:", date);
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
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Due Date"
              className="w-full p-2 mb-2 border rounded"
            />
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded">
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
