import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute: React.FC = () => {
  const { isUserLoggedIn, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <FullScreenLoader text="Checking your session..." />;
  }

  if (isUserLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
