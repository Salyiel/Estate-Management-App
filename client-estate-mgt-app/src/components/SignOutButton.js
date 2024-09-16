// SignOutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import '../styles/SignOutButton.css'

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Clear user-related data from local storage or state
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');

      // // Optionally, send a request to the backend to end the session
      // await axios.post('/api/sign-out');

      // Redirect to sign-in page
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return (
    <button className="signout-btn" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
