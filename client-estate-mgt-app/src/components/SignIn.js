import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css"; // Import the CSS file

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mocked backend user data for validation
    const mockUserData = {
      email: "john.doe@example.com",
      password: "password123",
      otp: "123456",
      position: "manager",
    };

    if (
      email === mockUserData.email &&
      password === mockUserData.password &&
      otp === mockUserData.otp
    ) {
      if (mockUserData.position === "manager") {
        navigate("/manager");
      } else if (mockUserData.position === "tenant") {
        navigate("/tenant");
      } else if (mockUserData.position === "employee") {
        navigate("/staff");
      }
    } else {
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
