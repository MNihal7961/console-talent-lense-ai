export const JobApplicationStatus = {
  APPLIED: "applied",
  SHORTLISTED: "shortListed",
  REJECTED: "rejected",
} as const;
export type JobApplicationStatus =
  (typeof JobApplicationStatus)[keyof typeof JobApplicationStatus];

export const ScreeningStatus = {
  PENDING: "pending",
  RESUME_PARSING_STARTED: "resume-parsing-started",
  RESUME_PARSED: "resume-parsed",
  RESUME_PARSING_FAILED: "resume-parsing-failed",
  SCREENING_STARTED: "screening-started",
  SCREENING_FAILED: "screening-failed",
  SCREENING_COMPLETED: "screening-completed",
} as const;
export type ScreeningStatus =
  (typeof ScreeningStatus)[keyof typeof ScreeningStatus];

export interface JobApplication {
  _id: string;
  candidateName: string | null;
  jobPostId: string;
  fileName: string;
  resumeId: string | null;
  status: JobApplicationStatus;
  screeningStatus: ScreeningStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
