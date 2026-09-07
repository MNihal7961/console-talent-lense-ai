import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Empty,
  FloatButton,
  Input,
  Modal,
  Tag,
  Typography,
} from "antd";
import { LoadingOutlined, QuestionOutlined } from "@ant-design/icons";
import {
  TbFileSearch,
  TbUpload,
  TbPlayerPlay,
  TbFileCheck,
  TbScan,
  TbGitCompare,
  TbReportSearch,
} from "react-icons/tb";
import useJobPosts from "../../hooks/useJobPosts";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import "./index.scss";

const { Title, Paragraph, Text } = Typography;

interface FlowStep {
  title: string;
  description: string;
  icon: ReactNode;
}

const HOW_IT_WORKS_STEPS: FlowStep[] = [
  {
    title: "Select Job Post",
    description: "Choose the role you want to screen candidates for.",
    icon: <TbFileSearch />,
  },
  {
    title: "Upload Resumes",
    description: "Add the candidate resumes you want to screen.",
    icon: <TbUpload />,
  },
  {
    title: "Start Screening",
    description: "Kick off screening with a single click.",
    icon: <TbPlayerPlay />,
  },
  {
    title: "Get Screening Result",
    description: "Review a ranked, explainable result for every candidate.",
    icon: <TbFileCheck />,
  },
];

const BEHIND_THE_SCENES_STEPS: FlowStep[] = [
  {
    title: "Parse Resume",
    description: "Extract skills, experience and education from each resume.",
    icon: <TbScan />,
  },
  {
    title: "Match Against Job Description",
    description: "Compare the parsed resume data against the job requirements.",
    icon: <TbGitCompare />,
  },
  {
    title: "Generate Screening Result",
    description: "Produce an explainable match score and report.",
    icon: <TbReportSearch />,
  },
];

const ScreeningStepper = ({ steps }: { steps: FlowStep[] }) => (
  <div className="screening-stepper">
    {steps.map((step, index) => (
      <div className="screening-stepper-item" key={step.title}>
        <div className="screening-stepper-node-row">
          <span className="screening-stepper-circle-wrap">
            <span className="screening-stepper-circle">{step.icon}</span>
            <span className="screening-stepper-badge">{index + 1}</span>
          </span>
        </div>
        <Text strong className="screening-stepper-title">
          {step.title}
        </Text>
        <Paragraph type="secondary" className="screening-stepper-desc">
          {step.description}
        </Paragraph>
      </div>
    ))}
  </div>
);

const Screening = () => {
  const navigate = useNavigate();
  const { jobPosts, isJobPostLoading } = useJobPosts();
  const [searchText, setSearchText] = useState("");
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const filteredJobPosts = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    if (!search) return jobPosts;

    return jobPosts.filter(
      (jobPost) =>
        jobPost.title?.toLowerCase().includes(search) ||
        jobPost.description?.toLowerCase().includes(search),
    );
  }, [jobPosts, searchText]);

  return (
    <div className="screening-page">
      <PageBreadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Screening" }]}
      />

      <div className="screening-intro">
        <Title level={4}>Screen Candidates</Title>
        <Paragraph type="secondary">
          Pick a job post below and start screening candidate resumes against
          it.
        </Paragraph>
      </div>

      <div className="screening-filters">
        <Input.Search
          className="screening-search"
          placeholder="Search by title or description"
          allowClear
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>

      {isJobPostLoading ? (
        <div className="screening-loading">
          <LoadingOutlined style={{ fontSize: 28 }} spin />
        </div>
      ) : filteredJobPosts.length === 0 ? (
        <Empty
          description={
            searchText.trim()
              ? "No job posts match your search."
              : "No job posts found."
          }
        />
      ) : (
        <div className="screening-grid">
          {filteredJobPosts.map((jobPost) => (
            <Card key={jobPost._id} className="screening-card">
              <Title level={5} className="screening-card-title" ellipsis>
                {jobPost.title}
              </Title>

              <Paragraph
                type="secondary"
                className="screening-card-description"
                ellipsis={{ rows: 3 }}
              >
                {jobPost.description}
              </Paragraph>

              {jobPost.requiredSkills?.length > 0 && (
                <div className="screening-card-skills">
                  {jobPost.requiredSkills.slice(0, 4).map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                  {jobPost.requiredSkills.length > 4 && (
                    <Tag>+{jobPost.requiredSkills.length - 4}</Tag>
                  )}
                </div>
              )}

              <Button
                type="primary"
                block
                icon={<TbPlayerPlay />}
                className="screening-card-cta"
                onClick={() => navigate(`/screening/${jobPost._id}`)}
              >
                Start Screening
              </Button>
            </Card>
          ))}
        </div>
      )}

      <FloatButton
        icon={<QuestionOutlined />}
        type="primary"
        tooltip="How screening works"
        onClick={() => setIsHowItWorksOpen(true)}
      />

      <Modal
        title="How Screening Works"
        open={isHowItWorksOpen}
        onCancel={() => setIsHowItWorksOpen(false)}
        footer={null}
        centered
        width={720}
        className="screening-how-it-works-modal"
      >
        <div className="screening-how-it-works">
          <ScreeningStepper steps={HOW_IT_WORKS_STEPS} />

          <div className="screening-behind-scenes">
            <Text strong className="screening-behind-scenes-label">
              What happens in the background when you start screening
            </Text>

            <ScreeningStepper steps={BEHIND_THE_SCENES_STEPS} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Screening;
