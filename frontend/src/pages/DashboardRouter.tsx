import React from "react";
import { Navigate } from "react-router-dom";
import DeoDashboard from "./Deo/Dashboard";
import SupervisorDashboard from "./Supervisor/Dashboard";
import AdDashboard from "./Ad/Dashboard";
import { useAuthStore } from "../stores/authStore";

const DashboardRouter: React.FC = () => {
  const { role } = useAuthStore();

  if (!role) {
    return <Navigate to="/login" replace={true} />;
  }

  switch (role) {
    case "deo":
      return <DeoDashboard />;
    case "supervisor":
      return <SupervisorDashboard />;
    case "ad":
      return <AdDashboard />;
    default:
      return <Navigate to="/login" replace={true} />;
  }
   
  
};

export default DashboardRouter;

