import React from "react";
import { Button, Typography } from "antd";
import { useAuth } from "../../contexts/AuthContext";

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>
        Welcome{user ? `, ${user.firstName} ${user.lastName}` : ""}
      </Typography.Title>
      <Button onClick={logout}>Sign out</Button>
    </div>
  );
};

export default Home;
