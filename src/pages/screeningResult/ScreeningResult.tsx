import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Drawer,
  Empty,
  Modal,
  Progress,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  TbBrandGithub,
  TbBrandLinkedin,
  TbCertificate,
  TbCircleCheck,
  TbCircleX,
  TbFileText,
  TbHelpCircle,
  TbLink,
  TbMail,
  TbPhone,
  TbSparkles,
  TbUserCheck,
  TbUserX,
} from "react-icons/tb";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import useScreeningResult from "../../hooks/useScreeningResult";
import useScreeningStatusUpdates from "../../hooks/useScreeningStatusUpdates";
import useJobApplicationStatusUpdate from "../../hooks/useJobApplicationStatusUpdate";
import {
  JobApplicationStatus,
  ScreeningStatus,
  type JobApplication,
} from "../../interface/job-application";
import {
  MatchStatus,
  RequirementCategory,
  RequirementStatus,
  type ScreeningRequirement,
  type ScreeningResult as ScreeningResultData,
} from "../../interface/screening-result";
import { SCREENING_STATUS_META } from "../../utils/screeningStatus";
import { CONFIDENCE_META, MATCH_STATUS_META } from "../../utils/matchStatus";
import { JOB_APPLICATION_STATUS_META } from "../../utils/jobApplicationStatus";
import { getErrorMessage } from "../../utils/error";
import "./index.scss";

const { Title, Paragraph, Text } = Typography;

const REQUIREMENT_CATEGORY_LABEL: Record<RequirementCategory, string> = {
  [RequirementCategory.REQUIRED_SKILL]: "Required Skills",
  [RequirementCategory.PREFERRED_SKILL]: "Preferred Skills",
  [RequirementCategory.EXPERIENCE]: "Experience",
  [RequirementCategory.EDUCATION]: "Education",
  [RequirementCategory.RESPONSIBILITY]: "Responsibilities",
};

const REQUIREMENT_STATUS_ICON: Record<RequirementStatus, React.ReactNode> = {
  [RequirementStatus.MATCHED]: (
    <TbCircleCheck className="screening-result-requirement-icon matched" />
  ),
  [RequirementStatus.MISSING]: (
    <TbCircleX className="screening-result-requirement-icon missing" />
  ),
  [RequirementStatus.UNCERTAIN]: (
    <TbHelpCircle className="screening-result-requirement-icon uncertain" />
  ),
};

const getAiSuggestedStatus = (
  screeningResult: ScreeningResultData,
): JobApplicationStatus => {
  switch (screeningResult.matchStatus) {
    case MatchStatus.STRONG_MATCH:
    case MatchStatus.GOOD_MATCH:
      return JobApplicationStatus.SHORTLISTED;
    case MatchStatus.WEAK_MATCH:
      return JobApplicationStatus.REJECTED;
    default:
      return screeningResult.matchScore >= 50
        ? JobApplicationStatus.SHORTLISTED
        : JobApplicationStatus.REJECTED;
  }
};

const groupRequirementsByCategory = (requirements: ScreeningRequirement[]) => {
  const groups = new Map<RequirementCategory, ScreeningRequirement[]>();

  requirements.forEach((requirement) => {
    const existing = groups.get(requirement.category) ?? [];
    groups.set(requirement.category, [...existing, requirement]);
  });

  return groups;
};

const ScreeningResult = () => {
  const { jobApplicationId } = useParams<{ jobApplicationId: string }>();
  const [isResumeDrawerOpen, setIsResumeDrawerOpen] = useState(false);
  const [pendingStatus, setPendingStatus] =
    useState<JobApplicationStatus | null>(null);
  const { isUpdating, updateStatus } = useJobApplicationStatusUpdate();
  const {
    jobApplication,
    setJobApplication,
    jobPost,
    resume,
    screeningResult,
    isLoading,
    reloadScreeningResult,
  } = useScreeningResult(jobApplicationId);

  const handleScreeningStatusUpdated = useCallback(
    (updatedJobApplication: JobApplication) => {
      if (updatedJobApplication._id !== jobApplicationId) return;

      setJobApplication(updatedJobApplication);

      if (
        updatedJobApplication.screeningStatus ===
        ScreeningStatus.SCREENING_COMPLETED
      ) {
        reloadScreeningResult();
      }
    },
    [jobApplicationId, setJobApplication, reloadScreeningResult],
  );

  useScreeningStatusUpdates(handleScreeningStatusUpdated);

  const handleConfirmStatusChange = async () => {
    if (!pendingStatus || !jobApplication) return;

    try {
      const updated = await updateStatus(jobApplication._id, pendingStatus);
      setJobApplication(updated);
      toast.success(
        `Marked ${jobApplication.candidateName ?? jobApplication.fileName} as ${JOB_APPLICATION_STATUS_META[pendingStatus].label}.`,
      );
      setPendingStatus(null);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Couldn't update the application status."),
      );
    }
  };

  const isCompleted =
    jobApplication?.screeningStatus === ScreeningStatus.SCREENING_COMPLETED;
  const isProcessingFailed =
    jobApplication?.screeningStatus ===
      ScreeningStatus.RESUME_PARSING_FAILED ||
    jobApplication?.screeningStatus === ScreeningStatus.SCREENING_FAILED;
  const statusMeta = jobApplication
    ? SCREENING_STATUS_META[jobApplication.screeningStatus]
    : null;

  const breadcrumbItems = [
    { label: "Dashboard", path: "/" },
    { label: "Screening", path: "/screening" },
    ...(jobPost && jobApplication
      ? [
          {
            label: jobPost.title,
            path: `/screening/${jobApplication.jobPostId}`,
          },
        ]
      : []),
    {
      label: isLoading ? (
        <LoadingOutlined spin />
      ) : (
        (jobApplication?.fileName ?? "Screening Result")
      ),
    },
  ];

  return (
    <div className="screening-result-page">
      <PageBreadcrumb items={breadcrumbItems} />

      {isLoading ? (
        <Card className="screening-result-card">
          <Skeleton active title={{ width: "30%" }} paragraph={{ rows: 6 }} />
        </Card>
      ) : !jobApplication ? (
        <Card className="screening-result-card">
          <Empty description="Job application not found." />
        </Card>
      ) : !isCompleted || !screeningResult ? (
        <Card className="screening-result-card">
          <div className="screening-result-processing">
            <Title level={4}>
              {!isProcessingFailed && (
                <LoadingOutlined
                  spin
                  className="screening-result-processing-spinner"
                />
              )}
              {isProcessingFailed ? "Screening failed" : "Screening in progress"}
            </Title>
            <Paragraph type="secondary">
              {isProcessingFailed
                ? `Something went wrong while screening "${jobApplication.fileName}". Try uploading it again.`
                : `We'll show the result for "${jobApplication.fileName}" here as soon as screening finishes.`}
            </Paragraph>
            {statusMeta && (
              <div className="screening-result-processing-bar">
                <Text type="secondary">{statusMeta.label}</Text>
                <Progress
                  percent={statusMeta.percent}
                  status={statusMeta.progressStatus}
                  size="small"
                />
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="screening-result-grid">
          <div className="screening-result-main">
            <Card className="screening-result-card">
              <div className="screening-result-header">
                <Progress
                  type="circle"
                  percent={screeningResult.matchScore}
                  size={96}
                  status={
                    screeningResult.matchStatus === MatchStatus.WEAK_MATCH
                      ? "exception"
                      : "success"
                  }
                />

                <div className="screening-result-header-info">
                  <Title level={4}>
                    {jobApplication.candidateName ?? jobApplication.fileName}
                  </Title>
                  {jobPost && (
                    <Text type="secondary">
                      Screened against {jobPost.title}
                    </Text>
                  )}
                  <Space size={[8, 8]} wrap className="screening-result-tags">
                    <Tag
                      color={
                        MATCH_STATUS_META[screeningResult.matchStatus].color
                      }
                    >
                      {MATCH_STATUS_META[screeningResult.matchStatus].label}
                    </Tag>
                    <Tag
                      color={CONFIDENCE_META[screeningResult.confidence].color}
                    >
                      {CONFIDENCE_META[screeningResult.confidence].label}
                    </Tag>
                  </Space>
                </div>
              </div>

              <Paragraph className="screening-result-summary">
                {screeningResult.summary}
              </Paragraph>
            </Card>

            <Card className="screening-result-card" title="Application Status">
              <div className="screening-result-status-current">
                <Text type="secondary">Current status:</Text>
                <Tag
                  color={
                    JOB_APPLICATION_STATUS_META[jobApplication.status].color
                  }
                >
                  {JOB_APPLICATION_STATUS_META[jobApplication.status].label}
                </Tag>
              </div>

              {jobApplication.status !== JobApplicationStatus.APPLIED ? (
                <div className="screening-result-status-decided">
                  {jobApplication.status ===
                  JobApplicationStatus.SHORTLISTED ? (
                    <TbCircleCheck className="screening-result-requirement-icon matched" />
                  ) : (
                    <TbCircleX className="screening-result-requirement-icon missing" />
                  )}
                  <Text>
                    Marked as{" "}
                    <Text strong>
                      {JOB_APPLICATION_STATUS_META[jobApplication.status].label}
                    </Text>{" "}
                    on{" "}
                    {dayjs(jobApplication.updatedAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </Text>
                </div>
              ) : (
                <>
                  <div
                    className={`screening-result-ai-suggestion ${
                      getAiSuggestedStatus(screeningResult) ===
                      JobApplicationStatus.SHORTLISTED
                        ? "positive"
                        : "negative"
                    }`}
                  >
                    <TbSparkles className="screening-result-ai-suggestion-icon" />
                    <Text>
                      <Text strong>TalentLens.ai</Text> recommends marking this
                      candidate as{" "}
                      <Text strong>
                        {
                          JOB_APPLICATION_STATUS_META[
                            getAiSuggestedStatus(screeningResult)
                          ].label
                        }
                      </Text>
                      .
                    </Text>
                  </div>

                  <div className="screening-result-status-actions">
                    <Button
                      icon={<TbUserCheck />}
                      className={
                        getAiSuggestedStatus(screeningResult) ===
                        JobApplicationStatus.SHORTLISTED
                          ? "screening-result-ai-cta glow-success"
                          : undefined
                      }
                      onClick={() =>
                        setPendingStatus(JobApplicationStatus.SHORTLISTED)
                      }
                    >
                      Mark as Shortlisted
                    </Button>

                    <Button
                      danger
                      icon={<TbUserX />}
                      className={
                        getAiSuggestedStatus(screeningResult) ===
                        JobApplicationStatus.REJECTED
                          ? "screening-result-ai-cta glow-danger"
                          : undefined
                      }
                      onClick={() =>
                        setPendingStatus(JobApplicationStatus.REJECTED)
                      }
                    >
                      Mark as Rejected
                    </Button>
                  </div>
                </>
              )}
            </Card>

            <Card className="screening-result-card" title="Requirements">
              {Array.from(
                groupRequirementsByCategory(screeningResult.requirements),
              ).map(([category, requirements]) => (
                <div key={category} className="screening-result-section">
                  <Title level={5}>
                    {REQUIREMENT_CATEGORY_LABEL[category]}
                  </Title>
                  <div className="screening-result-requirement-list">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="screening-result-requirement">
                        {REQUIREMENT_STATUS_ICON[requirement.status]}
                        <div className="screening-result-requirement-body">
                          <Text strong>{requirement.requirement}</Text>
                          <Paragraph
                            type="secondary"
                            className="screening-result-requirement-evidence"
                          >
                            {requirement.evidence}
                          </Paragraph>
                        </div>
                        <Tag
                          color={CONFIDENCE_META[requirement.confidence].color}
                        >
                          {requirement.confidence}
                        </Tag>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>

            {(screeningResult.strengths.length > 0 ||
              screeningResult.gaps.length > 0 ||
              screeningResult.uncertainties.length > 0) && (
              <Card className="screening-result-card" title="Highlights">
                {screeningResult.strengths.length > 0 && (
                  <div className="screening-result-section">
                    <Title level={5}>Strengths</Title>
                    <ul className="screening-result-list">
                      {screeningResult.strengths.map((strength, index) => (
                        <li key={index}>
                          <TbCircleCheck className="screening-result-requirement-icon matched" />
                          <Text>{strength}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {screeningResult.gaps.length > 0 && (
                  <div className="screening-result-section">
                    <Title level={5}>Gaps</Title>
                    <ul className="screening-result-list">
                      {screeningResult.gaps.map((gap, index) => (
                        <li key={index}>
                          <TbCircleX className="screening-result-requirement-icon missing" />
                          <Text>{gap}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {screeningResult.uncertainties.length > 0 && (
                  <div className="screening-result-section">
                    <Title level={5}>Uncertainties</Title>
                    <ul className="screening-result-list">
                      {screeningResult.uncertainties.map(
                        (uncertainty, index) => (
                          <li key={index}>
                            <TbHelpCircle className="screening-result-requirement-icon uncertain" />
                            <Text>{uncertainty}</Text>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </Card>
            )}

            <Card className="screening-result-card" title="Reasoning">
              <Paragraph type="secondary">
                {screeningResult.reasoning}
              </Paragraph>
            </Card>
          </div>

          <Card
            className="screening-result-card"
            title="Candidate"
            extra={
              resume?.rawFileLink && (
                <Button
                  size="small"
                  icon={<TbFileText />}
                  onClick={() => setIsResumeDrawerOpen(true)}
                >
                  View Resume
                </Button>
              )
            }
          >
            {!resume ? (
              <Empty description="Resume details unavailable." />
            ) : (
              <div className="screening-result-candidate">
                <Title level={5}>
                  {resume.user.firstName} {resume.user.lastName ?? ""}
                </Title>

                {resume.recentRole && (
                  <Text type="secondary">{resume.recentRole}</Text>
                )}

                <Space
                  direction="vertical"
                  size={4}
                  className="screening-result-contact"
                >
                  {resume.contactInfo.email && (
                    <Text>
                      <TbMail /> {resume.contactInfo.email}
                    </Text>
                  )}
                  {resume.contactInfo.phoneNumber && (
                    <Text>
                      <TbPhone /> {resume.contactInfo.phoneNumber}
                    </Text>
                  )}
                  {resume.links.linkedInUrl && (
                    <a
                      href={resume.links.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TbBrandLinkedin /> LinkedIn
                    </a>
                  )}
                  {resume.links.githubUrl && (
                    <a
                      href={resume.links.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TbBrandGithub /> GitHub
                    </a>
                  )}
                  {resume.links.portfolioUrl && (
                    <a
                      href={resume.links.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TbLink /> Portfolio
                    </a>
                  )}
                </Space>

                <Paragraph type="secondary">{resume.profileSummary}</Paragraph>

                <div className="screening-result-section">
                  <Title level={5}>Skills</Title>
                  <Space size={[8, 8]} wrap>
                    {resume.skills.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </Space>
                </div>

                {resume.experience.length > 0 && (
                  <div className="screening-result-section">
                    <Title level={5}>Experience</Title>
                    {resume.experience.map((experience, index) => (
                      <div key={index} className="screening-result-entry">
                        <Text strong>{experience.role}</Text>
                        <Text type="secondary">
                          {" "}
                          &middot; {experience.companyName}
                        </Text>
                        <Paragraph
                          type="secondary"
                          className="screening-result-entry-desc"
                        >
                          {experience.description}
                        </Paragraph>
                      </div>
                    ))}
                  </div>
                )}

                {resume.education.length > 0 && (
                  <div className="screening-result-section">
                    <Title level={5}>Education</Title>
                    {resume.education.map((education, index) => (
                      <div key={index} className="screening-result-entry">
                        <Text strong>{education.degree}</Text>
                        <Text type="secondary">
                          {" "}
                          &middot; {education.university}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}

                {resume.certifications.length > 0 && (
                  <div className="screening-result-section">
                    <Title level={5}>
                      <TbCertificate /> Certifications
                    </Title>
                    <ul className="screening-result-list">
                      {resume.certifications.map((certification, index) => (
                        <li key={index}>
                          <Text>{certification.title}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      <Drawer
        title={resume?.fileName ?? "Resume"}
        placement="right"
        width="min(600px, 100%)"
        open={isResumeDrawerOpen}
        onClose={() => setIsResumeDrawerOpen(false)}
        className="screening-result-resume-drawer"
      >
        {resume?.rawFileLink && (
          <iframe
            src={resume.rawFileLink}
            title={resume.fileName}
            className="screening-result-resume-iframe"
          />
        )}
      </Drawer>

      <Modal
        title={
          pendingStatus === JobApplicationStatus.SHORTLISTED
            ? "Shortlist this candidate?"
            : "Reject this candidate?"
        }
        open={pendingStatus !== null}
        centered
        confirmLoading={isUpdating}
        onOk={handleConfirmStatusChange}
        onCancel={() => setPendingStatus(null)}
        okText={
          pendingStatus === JobApplicationStatus.SHORTLISTED
            ? "Shortlist"
            : "Reject"
        }
        okButtonProps={{
          danger: pendingStatus === JobApplicationStatus.REJECTED,
        }}
      >
        <Typography.Paragraph>
          Mark{" "}
          <strong>
            {jobApplication?.candidateName ?? jobApplication?.fileName}
          </strong>{" "}
          as{" "}
          <strong>
            {pendingStatus
              ? JOB_APPLICATION_STATUS_META[pendingStatus].label
              : ""}
          </strong>
          ? This updates the application status for everyone reviewing this job
          post.
        </Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default ScreeningResult;
