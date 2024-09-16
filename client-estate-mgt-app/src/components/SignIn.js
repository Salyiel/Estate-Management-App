import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/SignIn.css"; 

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/signin", { email, password });
      console.log("Sign-in response:", response.data); // Debugging line
  
      const { position, user_id, user_name } = response.data;
  
      if (user_id) {
        localStorage.setItem("user_id", user_id); // Store user_id
      } else {
        console.error("User ID not found in response");
      }
  
      if (user_name) {
        localStorage.setItem("user_name", user_name); // Store user name
      } else {
        console.error("User name not found in response");
      }
  
      if (position) {
        localStorage.setItem("position", position);
      } else {
        console.error("Position not found in response");
      }
  
      console.log("Stored user_id:", user_id); // Debugging line
      console.log("Stored user_name:", user_name);
      console.log("Stored user position:", position);
  
      if (position === "manager") {
        navigate("/manager");
      } else if (position === "tenant") {
        navigate("/tenant");
      } else if (position === "employee") {
        navigate("/staff");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="container">
      <div className="signin-box">
        <div className="heading">
          <span>Sign In</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit">Sign In</button>
        </form>
        <div className="forgot-password">
          <a href="/">Forgot Password?</a>
        </div>
        <div className="signup-link">
          <p>Don't have an account? Try <Link to="/signup">Sign Up</Link>!</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
