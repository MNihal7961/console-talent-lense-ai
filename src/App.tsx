import { ConfigProvider } from "antd";
import React from "react";
import { ToastContainer } from "react-toastify";
import Router from "./router/Router";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4f46e5",
          colorLink: "#4f46e5",
          colorError: "#e5484d",
          colorSuccess: "#17a768",
          colorWarning: "#e8a531",
        },
      }}
    >
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        newestOnTop
        className="app-toast-container"
        toastClassName="app-toast"
      />
    </ConfigProvider>
  );
};

export default App;
