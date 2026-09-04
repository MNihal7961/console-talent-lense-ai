import { Typography } from "antd";

const AppFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Typography.Text>
          © {new Date().getFullYear()} TalentLens
          <span className="text-primary">.ai</span> | All rights reserved.
        </Typography.Text>
        <div className="footer-right">
          <Typography.Link>Support</Typography.Link>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
