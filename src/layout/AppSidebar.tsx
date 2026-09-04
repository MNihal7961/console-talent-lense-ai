import { Typography } from "antd";
import { IoGrid } from "react-icons/io5";

const AppSidebar = () => {
  return (
    <aside className="sidebar">
      <div>
        <Typography.Title level={4}>
          TalentLens<span className="text-primary">.ai</span>
        </Typography.Title>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-item sidebar-item-active ">
          <IoGrid />
          <Typography.Text className="sidebar-item-label">
            Dashboard
          </Typography.Text>
        </div>
      </nav>
    </aside>
  );
};

export default AppSidebar;
