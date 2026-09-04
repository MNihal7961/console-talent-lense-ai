import React from "react";
import { Typography } from "antd";
import "./index.scss";

interface FullScreenLoaderProps {
  text?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  text = "Loading, please wait...",
}) => {
  return (
    <div className="full-screen-loader">
      <span className="full-screen-loader-spinner" aria-hidden="true" />
      <Typography.Text strong className="full-screen-loader-text text-primary">
        {text}
      </Typography.Text>
    </div>
  );
};

export default FullScreenLoader;
