import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  Empty,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import useJobPost from "../../hooks/useJobPost";
import type { JobPost as JobPostType } from "../../interface/job-post";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import "./index.scss";

const formatDate = (date?: string) =>
  date ? dayjs(date).format("DD MMM YYYY").toUpperCase() : "-";

const formatExperienceValue = (years: number) => {
  if (years === -1) return "Not mentioned";
  if (years === 0) return "Fresher";
  return `${years} ${years === 1 ? "year" : "years"}`;
};

const formatExperienceRange = (experience: JobPostType["experience"]) => {
  const { minimumYears, maximumYears } = experience;

  if (minimumYears === -1 && maximumYears === -1) {
    return "Not mentioned";
  }

  if (minimumYears === 0 && maximumYears === 0) {
    return "Fresher";
  }

  return `${formatExperienceValue(minimumYears)} - ${formatExperienceValue(maximumYears)}`;
};

const JobPostDetailsSkeleton = () => (
  <div className="job-post-details-grid">
    <Card className="job-post-details-card">
      <Skeleton
        active
        title={{ width: "40%" }}
        paragraph={{ rows: 1, width: "25%" }}
      />

      <Space size={[8, 8]} wrap className="job-post-details-skeleton-tags">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton.Button key={index} active size="small" shape="round" />
        ))}
      </Space>

      <Skeleton
        active
        title={false}
        paragraph={{ rows: 4 }}
        className="job-post-details-skeleton-block"
      />

      <Skeleton
        active
        title={{ width: "30%" }}
        paragraph={{ rows: 2 }}
        className="job-post-details-skeleton-block"
      />

      <Skeleton
        active
        title={{ width: "30%" }}
        paragraph={{ rows: 3 }}
        className="job-post-details-skeleton-block"
      />
    </Card>

    <Card className="job-post-details-card">
      <Skeleton active title={{ width: "50%" }} paragraph={{ rows: 5 }} />
    </Card>
  </div>
);

const JobPostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isJobPostLoading, jobPost, loadJobPostDetails } = useJobPost();

  useEffect(() => {
    if (id) loadJobPostDetails(id);
  }, [id, loadJobPostDetails]);

  return (
    <div className="job-post-details-page">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Job Posts", path: "/job-post" },
          { label: jobPost?.title ?? "Job Post Details" },
        ]}
      />

      {isJobPostLoading ? (
        <JobPostDetailsSkeleton />
      ) : !jobPost ? (
        <Card className="job-post-details-card">
          <Empty description="Job post not found." />
        </Card>
      ) : (
        <div className="job-post-details-grid">
          <Card className="job-post-details-card">
            <div className="job-post-details-header">
              <Typography.Title level={3}>{jobPost.title}</Typography.Title>
              <Typography.Text type="secondary">
                Posted on {formatDate(jobPost.createdAt)}
              </Typography.Text>
            </div>

            <Typography.Paragraph>{jobPost.description}</Typography.Paragraph>

            <div className="job-post-details-section">
              <Typography.Title level={5}>Required Skills</Typography.Title>
              <Space size={[8, 8]} wrap>
                {jobPost.requiredSkills.map((skill) => (
                  <Tag color="blue" key={skill}>
                    {skill}
                  </Tag>
                ))}
              </Space>
            </div>

            <div className="job-post-details-section">
              <Typography.Title level={5}>Preferred Skills</Typography.Title>
              <Space size={[8, 8]} wrap>
                {jobPost.preferredSkills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </Space>
            </div>

            <div className="job-post-details-section">
              <Typography.Title level={5}>Responsibilities</Typography.Title>
              <ul className="job-post-details-list">
                {jobPost.responsibilities.map((responsibility, index) => (
                  <li key={index}>
                    <Typography.Text>{responsibility}</Typography.Text>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="job-post-details-card" title="Overview">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Experience">
                {formatExperienceRange(jobPost.experience)}
              </Descriptions.Item>
              <Descriptions.Item label="Education">
                {jobPost.education.required
                  ? jobPost.education.degree
                  : "Not required"}
              </Descriptions.Item>
              <Descriptions.Item label="Field of Study">
                {jobPost.education.field}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(jobPost.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(jobPost.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobPostDetails;
