import { useNavigate } from "react-router-dom";
import { Button, Card, Empty, Progress, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  TbEye,
  TbFileSearch,
  TbFileTypePdf,
  TbUserCircle,
} from "react-icons/tb";
import dayjs from "dayjs";
import type { JobPost } from "../../interface/job-post";
import {
  ScreeningStatus,
  type JobApplication,
} from "../../interface/job-application";
import { SCREENING_STATUS_META } from "../../utils/screeningStatus";

interface ScreeningHistoryProps {
  jobPost: JobPost | null;
  jobApplications: JobApplication[];
  isLoading: boolean;
}

const ScreeningHistory = ({
  jobPost,
  jobApplications,
  isLoading,
}: ScreeningHistoryProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="screening-history-loading">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    );
  }

  if (jobApplications.length === 0) {
    return (
      <div className="screening-history-empty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`No resumes screened yet for ${jobPost?.title ?? "this job post"}.`}
        />
      </div>
    );
  }

  return (
    <div className="screening-history">
      {jobApplications.map((jobApplication) => {
        const statusMeta =
          SCREENING_STATUS_META[jobApplication.screeningStatus];
        const isCompleted =
          jobApplication.screeningStatus ===
          ScreeningStatus.SCREENING_COMPLETED;
        const isFailed =
          jobApplication.screeningStatus ===
            ScreeningStatus.RESUME_PARSING_FAILED ||
          jobApplication.screeningStatus === ScreeningStatus.SCREENING_FAILED;

        return (
          <Card key={jobApplication._id} className="screening-history-item">
            <div className="screening-history-item-info">
              <span className="screening-history-item-icon">
                <TbFileSearch />
              </span>

              <div className="screening-history-item-text">
                <div className="screening-history-item-row">
                  <TbUserCircle className="screening-history-item-row-icon candidate" />
                  <Typography.Text className="screening-history-item-row-text">
                    {jobApplication.candidateName ??
                      (isFailed ? "-" : "Parsing...")}
                  </Typography.Text>
                </div>

                <div className="screening-history-item-row">
                  <TbFileTypePdf className="screening-history-item-row-icon file" />
                  <Typography.Text className="screening-history-item-row-text">
                    {jobApplication.fileName}
                  </Typography.Text>
                </div>

                <Typography.Text
                  type="secondary"
                  className="screening-history-item-date"
                >
                  {dayjs(jobApplication.createdAt).format(
                    "DD MMM YYYY, hh:mm A",
                  )}
                </Typography.Text>
              </div>
            </div>

            <div className="screening-history-item-actions">
              <div className="screening-history-item-progress">
                <div className="screening-history-item-progress-label">
                  <Typography.Text
                    type="secondary"
                    className="screening-history-item-progress-status"
                    title={statusMeta.label}
                  >
                    {!isCompleted && !isFailed && (
                      <LoadingOutlined
                        spin
                        className="screening-history-item-progress-spinner"
                      />
                    )}
                    {statusMeta.label}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    className="screening-history-item-progress-percent"
                  >
                    {statusMeta.percent}%
                  </Typography.Text>
                </div>
                <Progress
                  percent={statusMeta.percent}
                  status={statusMeta.progressStatus}
                  size="small"
                  showInfo={false}
                />
              </div>

              <Button
                icon={<TbEye />}
                disabled={!isCompleted}
                onClick={() =>
                  navigate(`/screening/result/${jobApplication._id}`)
                }
              >
                View Results
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ScreeningHistory;
