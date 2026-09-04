import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./index.scss";

const Layout: React.FC = () => {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="main-wrapper">
        <AppHeader />
        <main className="main-content">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </div>
  );
};

export default Layout;
