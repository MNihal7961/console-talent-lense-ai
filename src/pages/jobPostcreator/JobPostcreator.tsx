import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import useJobPostSave from "../../hooks/useJobPostSave";
import type { GeneratedJobPost } from "../../interface/job-post";
import PageBreadcrumb from "../../components/common/PageBreadcrumb";
import { getErrorMessage } from "../../utils/error";
import "./index.scss";

interface LocationState {
  generatedJobPost?: GeneratedJobPost;
}

const FieldLabel = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <span className="job-post-creator-label">
    <Typography.Text strong>{label}</Typography.Text>
    <Tooltip title={tooltip}>
      <InfoCircleOutlined className="job-post-creator-info-icon" />
    </Tooltip>
  </span>
);

interface DynamicListFieldProps {
  name: string;
  label: string;
  tooltip: string;
  placeholder: string;
  addLabel: string;
  emptyMessage: string;
  required?: boolean;
}

const DynamicListField = ({
  name,
  label,
  tooltip,
  placeholder,
  addLabel,
  emptyMessage,
  required,
}: DynamicListFieldProps) => (
  <div className="job-post-creator-field-group">
    <FieldLabel label={label} tooltip={tooltip} />

    <Form.List
      name={name}
      rules={[
        {
          validator: async (_, list: string[]) => {
            if (required && (!list || list.length < 1)) {
              return Promise.reject(new Error(emptyMessage));
            }

            if (list && list.length) {
              const seen = new Set<string>();
              for (const item of list) {
                const normalized = (item ?? "").trim().toLowerCase();
                if (normalized && seen.has(normalized)) {
                  return Promise.reject(
                    new Error("Duplicate entries are not allowed."),
                  );
                }
                seen.add(normalized);
              }
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <div className="job-post-creator-list">
          {fields.map((field) => (
            <div className="job-post-creator-list-row" key={field.key}>
              <Form.Item
                {...field}
                noStyle
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "This field can't be empty.",
                  },
                ]}
              >
                <Input placeholder={placeholder} />
              </Form.Item>
              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                onClick={() => remove(field.name)}
              />
            </div>
          ))}

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={() => add("")}
          >
            {addLabel}
          </Button>

          <Form.ErrorList errors={errors} />
        </div>
      )}
    </Form.List>
  </div>
);

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <Typography.Title level={5} className="job-post-creator-section-title">
    {children}
  </Typography.Title>
);

const JobPostcreator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const generatedJobPost = (location.state as LocationState | null)
    ?.generatedJobPost;

  const [form] = Form.useForm<GeneratedJobPost>();
  const { isSaving, saveJobPost } = useJobPostSave();

  useEffect(() => {
    if (!generatedJobPost) {
      navigate(-1);
    }
  }, [generatedJobPost, navigate]);

  if (!generatedJobPost) {
    return null;
  }

  const handleSave = async (values: GeneratedJobPost) => {
    try {
      const savedJobPost = await saveJobPost(values);
      toast.success(`"${savedJobPost.title}" saved successfully.`);
      setTimeout(() => {
        navigate(`/job-post/${savedJobPost._id}`);
      }, 800);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to save the job post. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="job-post-creator-page">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Job Posts", path: "/job-post" },
          { label: "Generate", path: "/job-post/generate" },
          { label: "Review & Save" },
        ]}
      />

      <Card className="job-post-creator-card">
        <Form<GeneratedJobPost>
          form={form}
          layout="vertical"
          scrollToFirstError
          requiredMark={false}
          initialValues={generatedJobPost}
          onFinish={handleSave}
          className="job-post-creator-form"
        >
          <div className="job-post-creator-body">
            <Form.Item
              label={
                <FieldLabel
                  label="Title"
                  tooltip="The job title candidates will see, e.g. Senior Backend Engineer."
                />
              }
              name="title"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Enter a job title.",
                },
                { min: 3, message: "Title should be at least 3 characters." },
              ]}
            >
              <Input size="large" placeholder="e.g. Senior Backend Engineer" />
            </Form.Item>

            <Form.Item
              label={
                <FieldLabel
                  label="Description"
                  tooltip="A summary of the role, the team, and what the candidate will be doing day to day."
                />
              }
              name="description"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Enter a job description.",
                },
                {
                  min: 20,
                  message: "Description should be at least 20 characters.",
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 10 }} />
            </Form.Item>

            <DynamicListField
              name="requiredSkills"
              label="Required Skills"
              tooltip="Must-have skills a candidate needs to be considered for this role."
              placeholder="e.g. Node.js"
              addLabel="Add Required Skill"
              emptyMessage="Add at least one required skill."
              required
            />

            <DynamicListField
              name="preferredSkills"
              label="Preferred Skills"
              tooltip="Nice-to-have skills that give a candidate an edge, but aren't mandatory."
              placeholder="e.g. Docker"
              addLabel="Add Preferred Skill"
              emptyMessage="Add at least one preferred skill."
            />

            <DynamicListField
              name="responsibilities"
              label="Responsibilities"
              tooltip="Day-to-day duties and outcomes expected from this role."
              placeholder="e.g. Design and build APIs"
              addLabel="Add Responsibility"
              emptyMessage="Add at least one responsibility."
              required
            />

            <SectionTitle>Education</SectionTitle>

            <div className="job-post-creator-2-col">
              <Form.Item
                label={
                  <FieldLabel
                    label="Degree"
                    tooltip="Minimum degree required for this role, e.g. Bachelor's."
                  />
                }
                name={["education", "degree"]}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Enter the required degree.",
                  },
                ]}
              >
                <Input placeholder="e.g. Bachelor's" />
              </Form.Item>

              <Form.Item
                label={
                  <FieldLabel
                    label="Field of Study"
                    tooltip="Preferred academic field, e.g. Computer Science or related field."
                  />
                }
                name={["education", "field"]}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Enter the field of study.",
                  },
                ]}
              >
                <Input placeholder="e.g. Computer Science or related field" />
              </Form.Item>
            </div>

            <Form.Item
              label={
                <FieldLabel
                  label="Education Required"
                  tooltip="Turn this on if a formal degree is mandatory for this role."
                />
              }
              name={["education", "required"]}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <SectionTitle>Experience</SectionTitle>

            <div className="job-post-creator-2-col">
              <Form.Item
                label={
                  <FieldLabel
                    label="Minimum Years"
                    tooltip="Minimum years of relevant experience required. Use -1 if not mentioned."
                  />
                }
                name={["experience", "minimumYears"]}
                rules={[
                  {
                    required: true,
                    message: "Enter minimum years of experience.",
                  },
                ]}
              >
                <InputNumber className="job-post-creator-number" min={-1} />
              </Form.Item>

              <Form.Item
                label={
                  <FieldLabel
                    label="Maximum Years"
                    tooltip="Maximum years of experience expected. Use -1 if not mentioned."
                  />
                }
                name={["experience", "maximumYears"]}
                dependencies={[["experience", "minimumYears"]]}
                rules={[
                  {
                    required: true,
                    message: "Enter maximum years of experience.",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const minimumYears = getFieldValue([
                        "experience",
                        "minimumYears",
                      ]);
                      if (
                        value === undefined ||
                        value === null ||
                        minimumYears === undefined ||
                        minimumYears === null ||
                        value === -1 ||
                        minimumYears === -1 ||
                        value >= minimumYears
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Maximum years can't be less than minimum years.",
                        ),
                      );
                    },
                  }),
                ]}
              >
                <InputNumber className="job-post-creator-number" min={-1} />
              </Form.Item>
            </div>
          </div>

          <div className="job-post-creator-actions">
            <Button
              size="large"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              Back
            </Button>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={isSaving}
            >
              Save Job Post
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default JobPostcreator;
