import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Button, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { TbUpload } from "react-icons/tb";
import type { JobPost } from "../../interface/job-post";
import type { JobApplication } from "../../interface/job-application";
import useScreeningUpload from "../../hooks/useScreeningUpload";
import { MAX_PDF_FILE_SIZE_BYTES, isPdfFile } from "../../utils/pdf";
import { getErrorMessage } from "../../utils/error";

interface ScreeningUploadProps {
  jobPost: JobPost | null;
  onUploaded: (jobApplication: JobApplication) => void;
}

const ScreeningUpload = ({ jobPost, onUploaded }: ScreeningUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadResume } = useScreeningUpload();

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !jobPost) return;

    if (!isPdfFile(file)) {
      toast.error("Only PDF files are supported.");
      return;
    }

    if (file.size > MAX_PDF_FILE_SIZE_BYTES) {
      toast.error("PDF file must be 5MB or smaller.");
      return;
    }

    try {
      const jobApplication = await uploadResume(jobPost._id, file);
      toast.success(`Screening started for "${file.name}".`);
      onUploaded(jobApplication);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Couldn't start screening for that resume."),
      );
    }
  };

  return (
    <div className="screening-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={handleFileSelect}
      />

      <div className="screening-upload-dropzone">
        <span className="screening-upload-icon">
          {isUploading ? <LoadingOutlined spin /> : <TbUpload />}
        </span>
        <Typography.Title level={5}>Upload a resume</Typography.Title>
        <Typography.Text type="secondary">
          PDF only, up to 5MB. We'll parse it and screen it against{" "}
          {jobPost?.title ?? "this job post"}.
        </Typography.Text>

        <Button
          type="primary"
          className="screening-upload-button"
          loading={isUploading}
          disabled={!jobPost}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? "Uploading..." : "Choose PDF"}
        </Button>
      </div>
    </div>
  );
};

export default ScreeningUpload;
