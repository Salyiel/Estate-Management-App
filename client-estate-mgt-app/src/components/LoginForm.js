import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to the Estate Management System
        </h2>
        <div className="flex justify-around mt-8 space-y-6">
          <button
            onClick={() => navigate("/signin")}
            className="py-2 px-4 bg-indigo-600 text-white rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="py-2 px-4 bg-indigo-600 text-white rounded"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
