import { JobApplicationStatus } from "../interface/job-application";

export const JOB_APPLICATION_STATUS_META: Record<
  JobApplicationStatus,
  { label: string; color: string }
> = {
  [JobApplicationStatus.APPLIED]: { label: "Applied", color: "default" },
  [JobApplicationStatus.SHORTLISTED]: {
    label: "Shortlisted",
    color: "success",
  },
  [JobApplicationStatus.REJECTED]: { label: "Rejected", color: "error" },
};
