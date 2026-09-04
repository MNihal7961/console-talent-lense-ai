import { Typography } from "antd";
import { IoGrid } from "react-icons/io5";

interface SidebarContentProps {
  onNavigate?: () => void;
}

const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
  return (
    <>
      <div>
        <Typography.Title level={4}>
          TalentLens<span className="text-primary">.ai</span>
        </Typography.Title>
      </div>

      <nav className="sidebar-nav">
        <div
          className="sidebar-item sidebar-item-active "
          onClick={onNavigate}
        >
          <IoGrid />
          <Typography.Text className="sidebar-item-label">
            Dashboard
          </Typography.Text>
        </div>
      </nav>
    </>
  );
};

export default SidebarContent;
