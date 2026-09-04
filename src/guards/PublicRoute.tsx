import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute: React.FC = () => {
  const { isUserLoggedIn, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="route-guard-loader">
        <Spin size="large" />
      </div>
    );
  }

  if (isUserLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
