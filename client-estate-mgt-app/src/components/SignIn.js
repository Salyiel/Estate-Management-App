import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignIn.css"; 

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
        otp,
      });

      const { data } = response;
      if (data.position === "manager") {
        navigate("/manager");
      } else if (data.position === "tenant") {
        navigate("/tenant");
      } else if (data.position === "staff") {
        navigate("/staff");
      }
    } catch (err) {
      setError("Invalid email, password, or OTP.");
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
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter your OTP"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit">Sign In</button>
        </form>
        <div className="forgot-password">
          <a href="/">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;