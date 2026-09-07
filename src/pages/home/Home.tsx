import { Card, Typography } from "antd";
import {
  TbBriefcase,
  TbFileText,
  TbUserCheck,
  TbUserX,
} from "react-icons/tb";
import { useAuth } from "../../contexts/AuthContext";
import "./index.scss";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return { text: "Good morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
};

const STATS = [
  {
    key: "job-posts",
    label: "Total Job Posts",
    value: 12,
    icon: <TbBriefcase />,
    accent: "primary",
  },
  {
    key: "applications",
    label: "Total Applications",
    value: 86,
    icon: <TbFileText />,
    accent: "primary",
  },
  {
    key: "shortlisted",
    label: "Shortlisted",
    value: 34,
    icon: <TbUserCheck />,
    accent: "success",
  },
  {
    key: "rejected",
    label: "Rejected",
    value: 10,
    icon: <TbUserX />,
    accent: "danger",
  },
] as const;

const Home = () => {
  const { user } = useAuth();
  const greeting = getGreeting();

  return (
    <div className="home-page">
      <div className="home-greeting">
        <Typography.Title level={3} className="home-greeting-title">
          {greeting.text}, {user?.firstName ?? "there"} {greeting.emoji}
        </Typography.Title>
        <Typography.Text type="secondary" className="home-greeting-subtitle">
          Here's what's happening with your hiring pipeline today.
        </Typography.Text>
      </div>

      <div className="home-stats-grid">
        {STATS.map((stat) => (
          <Card key={stat.key} className="home-stat-card">
            <span className={`home-stat-icon ${stat.accent}`}>
              {stat.icon}
            </span>
            <div className="home-stat-body">
              <Typography.Title level={3} className="home-stat-value">
                {stat.value}
              </Typography.Title>
              <Typography.Text type="secondary" className="home-stat-label">
                {stat.label}
              </Typography.Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
