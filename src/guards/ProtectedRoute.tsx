import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { isUserLoggedIn, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <FullScreenLoader text="Checking your session..." />;
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
