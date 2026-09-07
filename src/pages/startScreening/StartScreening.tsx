import { useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useJobPost from "../../hooks/useJobPost";
import useJobApplications from "../../hooks/useJobApplications";
import useScreeningStatusUpdates from "../../hooks/useScreeningStatusUpdates";
import type { JobApplication } from "../../interface/job-application";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import ScreeningUpload from "./ScreeningUpload";
import ScreeningHistory from "./ScreeningHistory";
import "./index.scss";

type StartScreeningTab = "upload" | "history";

const StartScreening = () => {
  const { jobPostId } = useParams<{ jobPostId: string }>();
  const { jobPost, isJobPostLoading, loadJobPostDetails } = useJobPost();
  const { jobApplications, setJobApplications, isJobApplicationsLoading } =
    useJobApplications(jobPostId);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: StartScreeningTab =
    searchParams.get("tab") === "history" ? "history" : "upload";

  const handleTabChange = (key: string) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", key);
        return prev;
      },
      { replace: true },
    );
  };

  const handleUploaded = (jobApplication: JobApplication) => {
    setJobApplications((prev) => [jobApplication, ...prev]);
    handleTabChange("history");
  };

  const handleScreeningStatusUpdated = useCallback(
    (updatedJobApplication: JobApplication) => {
      if (updatedJobApplication.jobPostId !== jobPostId) return;

      setJobApplications((prev) => {
        const exists = prev.some(
          (jobApplication) => jobApplication._id === updatedJobApplication._id,
        );

        if (!exists) return [updatedJobApplication, ...prev];

        return prev.map((jobApplication) =>
          jobApplication._id === updatedJobApplication._id
            ? updatedJobApplication
            : jobApplication,
        );
      });
    },
    [jobPostId, setJobApplications],
  );

  useScreeningStatusUpdates(handleScreeningStatusUpdated);

  const tabItems = [
    {
      key: "upload" as StartScreeningTab,
      label: "Upload",
      children: (
        <ScreeningUpload jobPost={jobPost} onUploaded={handleUploaded} />
      ),
    },
    {
      key: "history" as StartScreeningTab,
      label: "History",
      children: (
        <ScreeningHistory
          jobPost={jobPost}
          jobApplications={jobApplications}
          isLoading={isJobApplicationsLoading}
        />
      ),
    },
  ];

  useEffect(() => {
    if (jobPostId) loadJobPostDetails(jobPostId);
  }, [jobPostId, loadJobPostDetails]);

  return (
    <div className="start-screening-page">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Screening", path: "/screening" },
          {
            label: isJobPostLoading ? (
              <LoadingOutlined spin />
            ) : (
              (jobPost?.title ?? "Start Screening")
            ),
          },
        ]}
      />

      <Tabs
        className="start-screening-tabs"
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
      />
    </div>
  );
};

export default StartScreening;
