import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Typography,
  type MenuProps,
} from "antd";
import { BiSupport } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSearch, FiUser } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import useLogout from "../hooks/useLogout";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import {
  getUserInitials,
  upperCaseFirstLetter,
} from "../utils/commonFunctions";

const AppHeader = () => {
  const { handleLogout } = useLogout();
  const { user } = useAuth();
  const { openMobileSidebar } = useSidebar();

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: "Profile", icon: <FiUser /> },
    { type: "divider" },
    {
      key: "logout",
      label: "Sign out",
      icon: <FiLogOut />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header">
      <Button
        icon={<HiOutlineMenu />}
        shape="round"
        className="header-menu-btn"
        onClick={openMobileSidebar}
        aria-label="Open sidebar"
      />
      <div className="header-search-wrapper">
        <Input
          prefix={<FiSearch />}
          placeholder="Search candidates, job posts and more..."
        />
      </div>
      <div className="header-right">
        <Button icon={<FaRegBell />} shape="round" />
        <Button icon={<BiSupport />} shape="round" />
        {user && <div className="divider" />}
        {user && (
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click", "hover"]}
            placement="bottomRight"
            align={{ offset: [0, 16] }}
          >
            <div className="header-user">
              <Avatar
                shape="circle"
                className="user-avatar"
                alt=""
                icon={
                  <Typography.Text className="text-white" strong>
                    {getUserInitials(user)}
                  </Typography.Text>
                }
              />
              <div className="header-user-info">
                <Typography.Text>
                  {upperCaseFirstLetter(user.firstName)}{" "}
                  {upperCaseFirstLetter(user.lastName)}
                </Typography.Text>
                <Typography.Text type="secondary" className="header-user-role">
                  {upperCaseFirstLetter(user.role)}
                </Typography.Text>
              </div>
              <FiChevronDown className="header-user-chevron" />
            </div>
          </Dropdown>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
