import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import '../styles/SignUp.css';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("tenant");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const userData = { name, email, password, position, phone }; // Include phone if necessary
    console.log("Sign Up:", userData);
  
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("User signed up successfully");
          navigate("/signin"); // Redirect to Sign-In page
        } else {
          console.log("Failed to sign up");
        }
      })
      .catch((error) => console.error("Error:", error));
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
            <label htmlFor="phone">Phone</label>
            <input
              type="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
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
        <p className="sign-in-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
