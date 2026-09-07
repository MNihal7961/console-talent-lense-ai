import { Typography } from "antd";
import { IoBriefcase, IoGrid } from "react-icons/io5";
import { TbFileSearch } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarContentProps {
  onNavigate?: () => void;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: <IoGrid /> },
  { path: "/job-post", label: "Job Posts", icon: <IoBriefcase /> },
  { path: "/screening", label: "Screening", icon: <TbFileSearch size={20}/> },
];

const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.includes(path);

  return (
    <>
      <div>
        <Typography.Title level={4}>
          TalentLens<span className="text-primary">.ai</span>
        </Typography.Title>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-item ${
              isActive(item.path) ? "sidebar-item-active" : ""
            }`}
            onClick={() => handleNavigate(item.path)}
          >
            {item.icon}
            <Typography.Text className="sidebar-item-label">
              {item.label}
            </Typography.Text>
          </div>
        ))}
      </nav>
    </>
  );
};

export default SidebarContent;
