import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TbPlayerPlay } from "react-icons/tb";
import useJobPost from "../../hooks/useJobPost";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import JobPostDetailsInfo from "./JobPostDetailsInfo";
import JobPostApplications from "./JobPostApplications";
import "./index.scss";

type JobPostDetailsTab = "details" | "applications";

const JobPostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isJobPostLoading, jobPost, loadJobPostDetails } = useJobPost();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: JobPostDetailsTab =
    searchParams.get("tab") === "applications" ? "applications" : "details";

  const handleTabChange = (key: string) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", key);
        return prev;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (id) loadJobPostDetails(id);
  }, [id, loadJobPostDetails]);

  return (
    <div className="job-post-details-page">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Job Posts", path: "/job-post" },
          {
            label: isJobPostLoading ? (
              <LoadingOutlined spin />
            ) : (
              (jobPost?.title ?? "Job Post Details")
            ),
          },
        ]}
        cta={
          id && (
            <Button
              type="primary"
              icon={<TbPlayerPlay />}
              onClick={() => navigate(`/screening/${id}`)}
            >
              Start Screening
            </Button>
          )
        }
      />

      <Tabs
        className="job-post-details-tabs"
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: "details" as JobPostDetailsTab,
            label: "Details",
            children: (
              <div className="job-post-details-tab-content">
                <JobPostDetailsInfo
                  jobPost={jobPost}
                  isLoading={isJobPostLoading}
                />
              </div>
            ),
          },
          {
            key: "applications" as JobPostDetailsTab,
            label: "Applications",
            children: (
              <div className="job-post-details-tab-content">
                <JobPostApplications jobPostId={id} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default JobPostDetails;
