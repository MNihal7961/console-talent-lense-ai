import { Card, Skeleton, Typography } from "antd";
import {
  TbBriefcase,
  TbFileText,
  TbUserCheck,
  TbUserX,
} from "react-icons/tb";
import { useAuth } from "../../contexts/AuthContext";
import useStatistics from "../../hooks/useStatistics";
import CountUpNumber from "./CountUpNumber";
import "./index.scss";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return { text: "Good morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
};

const Home = () => {
  const { user } = useAuth();
  const { statistics, isStatisticsLoading } = useStatistics();
  const greeting = getGreeting();

  const stats = [
    {
      key: "job-posts",
      label: "Total Job Posts",
      value: statistics?.totalJobPosts ?? 0,
      icon: <TbBriefcase />,
      accent: "primary",
    },
    {
      key: "applications",
      label: "Total Applications",
      value: statistics?.totalApplications ?? 0,
      icon: <TbFileText />,
      accent: "primary",
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      value: statistics?.shortlisted ?? 0,
      icon: <TbUserCheck />,
      accent: "success",
    },
    {
      key: "rejected",
      label: "Rejected",
      value: statistics?.rejected ?? 0,
      icon: <TbUserX />,
      accent: "danger",
    },
  ] as const;

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
        {stats.map((stat) => (
          <Card key={stat.key} className="home-stat-card">
            <span className={`home-stat-icon ${stat.accent}`}>
              {stat.icon}
            </span>
            <div className="home-stat-body">
              {isStatisticsLoading ? (
                <Skeleton.Button
                  active
                  size="small"
                  className="home-stat-value-skeleton"
                />
              ) : (
                <Typography.Title level={3} className="home-stat-value">
                  <CountUpNumber value={stat.value} />
                </Typography.Title>
              )}
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
