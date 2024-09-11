import React, { useState } from "react";
import '../styles/SignUp.css'; // Add this line to import the CSS

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("tenant");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign Up:", { name, email, password, position });
  };

  return (
    <div className="container">
      <div className="signup-box">
        <h2 className="heading">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option value="tenant">Tenant</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
