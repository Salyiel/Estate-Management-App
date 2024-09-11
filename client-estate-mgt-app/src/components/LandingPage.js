import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css"

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main">
      <div className="title">
        <h1>Welcome to the Estate Management System</h1>
      </div>
      <div className="page-center bg-light">
        <div className="content-box">
          
          <div className="btn-group">
            <button
              onClick={() => navigate("/signin")}
              className="btn-primary"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="btn-primary"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
