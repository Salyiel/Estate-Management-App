import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import TenantDashboard from "./components/TenantDashboard";
import StaffDashboard from "./components/StaffDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import PaymentForm from "./navigate/PaymentForm";
import Requests from "./navigate/Requests";
import CommentsFeedbacks from "./navigate/CommentsFeedbacks";
import Notifications from "./navigate/Notifications";
import WorkSchedule from "./navigate/WorkSchedule";
import CheckInOut from "./navigate/CheckInOut";
import TaskManagement from "./navigate/TaskManagement";
import StaffComment from "./navigate/StaffComment";
import TenantManagement from "./navigate/TenantManagement";
import StaffManagement from "./navigate/StaffManagement";
import MaintenanceManagement from "./navigate/MaintenanceManagement";
import ManagerReports from "./navigate/ManagerReports";
import ManagerFeedback from "./navigate/ManagerFeedback";
import StaffNotifications from "./navigate/StaffNotifications";



// Protected route function
// eslint-disable-next-line
const ProtectedRoute = ({ element, isAuthenticated, redirectPath = "/signin", ...rest }) => {
  return isAuthenticated ? element : <Navigate to={redirectPath} />;
};

function App() {
  // eslint-disable-next-line
  const [data, setData] = useState([{}]);
  // eslint-disable-next-line
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line
  const [userRole, setUserRole] = useState(""); // tenant, staff, manager

  // Check authentication on app mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info (role, etc.)
      fetch("/auth/validate-token", { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(true);
        setUserRole(data.role); // Set user role based on the backend response (tenant, staff, or manager)
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/tenant" element={<TenantDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/request" element={<Requests />} />
        <Route path="/comment" element={<CommentsFeedbacks />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/work-schedule" element={<WorkSchedule />} />
        <Route path="/status" element={<CheckInOut />} />
        <Route path="/tasks" element={<TaskManagement />} /> 
        <Route path="/staff-comment" element={<StaffComment />} />
        <Route path="/tenant-management" element={<TenantManagement />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/maintenance-management" element={<MaintenanceManagement />} />
        <Route path="/manager-reports" element={<ManagerReports />} />
        <Route path="/manager-feedback" element={<ManagerFeedback />} />
        <Route path="/staff-notification" element={<StaffNotifications />} />
      </Routes>
    </Router>
  );
}

export default App;