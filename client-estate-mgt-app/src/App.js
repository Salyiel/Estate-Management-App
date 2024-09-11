import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
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

function App() {
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

      </Routes>
    </Router>
  );
}

export default App;
