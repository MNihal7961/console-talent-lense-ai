import { Drawer } from "antd";
import { useSidebar } from "../contexts/SidebarContext";
import SidebarContent from "./SidebarContent";

const AppMobileSidebar = () => {
  const { isMobileSidebarOpen, closeMobileSidebar } = useSidebar();

  return (
    <Drawer
      placement="left"
      open={isMobileSidebarOpen}
      onClose={closeMobileSidebar}
      width={256}
      closable={false}
      rootClassName="mobile-sidebar-drawer"
      styles={{
        body: {
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        },
      }}
    >
      <SidebarContent onNavigate={closeMobileSidebar} />
    </Drawer>
  );
};

export default AppMobileSidebar;
