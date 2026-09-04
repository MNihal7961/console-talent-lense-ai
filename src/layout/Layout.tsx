import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../contexts/SidebarContext";
import AppSidebar from "./AppSidebar";
import AppMobileSidebar from "./AppMobileSidebar";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./index.scss";

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="app-shell">
        <AppSidebar />
        <AppMobileSidebar />
        <div className="main-wrapper">
          <AppHeader />
          <main className="main-content">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
