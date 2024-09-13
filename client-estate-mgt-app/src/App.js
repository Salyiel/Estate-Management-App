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

// Protected route function
const ProtectedRoute = ({ element, isAuthenticated, redirectPath = "/signin", ...rest }) => {
  return isAuthenticated ? element : <Navigate to={redirectPath} />;
};

function App() {
  const [data, setData] = useState([{}]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Tenant Routes */}
        <Route path="/tenant" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'tenant'} element={<TenantDashboard />} />} />
        <Route path="/payment" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'tenant'} element={<PaymentForm />} />} />
        <Route path="/request" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'tenant'} element={<Requests />} />} />
        <Route path="/comment" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<CommentsFeedbacks />} />} />
        <Route path="/notification" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Notifications />} />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'staff'} element={<StaffDashboard />} />} />
        <Route path="/work-schedule" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'staff'} element={<WorkSchedule />} />} />
        <Route path="/status" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'staff'} element={<CheckInOut />} />} />
        <Route path="/tasks" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'staff'} element={<TaskManagement />} />} />
        <Route path="/staff-comment" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'staff'} element={<StaffComment />} />} />

        {/* Manager Routes */}
        <Route path="/manager" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'manager'} element={<ManagerDashboard />} />} />
        <Route path="/tenant-management" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'manager'} element={<TenantManagement />} />} />
        <Route path="/staff-management" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'manager'} element={<StaffManagement />} />} />
        <Route path="/maintenance-management" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'manager'} element={<MaintenanceManagement />} />} />
        <Route path="/manager-reports" element={<ProtectedRoute isAuthenticated={isAuthenticated && userRole === 'manager'} element={<ManagerReports />} />} />
      </Routes>
    </Router>
  );
}

export default App;