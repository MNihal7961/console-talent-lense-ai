import React from "react";
import { Button, Typography } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import useLogout from "../../hooks/useLogout";

const Home: React.FC = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>
        Welcome{user ? `, ${user.firstName} ${user.lastName}` : ""}
      </Typography.Title>
      <Button onClick={handleLogout}>Sign out</Button>
    </div>
  );
};

export default Home;
