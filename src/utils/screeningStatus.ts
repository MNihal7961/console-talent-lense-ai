import { ScreeningStatus } from "../interface/job-application";

export type ScreeningProgressStatus = "active" | "success" | "exception";

export interface ScreeningStatusMeta {
  label: string;
  percent: number;
  progressStatus: ScreeningProgressStatus;
}

export const SCREENING_STATUS_META: Record<ScreeningStatus, ScreeningStatusMeta> = {
  [ScreeningStatus.PENDING]: {
    label: "Queued",
    percent: 0,
    progressStatus: "active",
  },
  [ScreeningStatus.RESUME_PARSING_STARTED]: {
    label: "Parsing resume",
    percent: 25,
    progressStatus: "active",
  },
  [ScreeningStatus.RESUME_PARSED]: {
    label: "Resume parsed",
    percent: 50,
    progressStatus: "active",
  },
  [ScreeningStatus.RESUME_PARSING_FAILED]: {
    label: "Resume parsing failed",
    percent: 25,
    progressStatus: "exception",
  },
  [ScreeningStatus.SCREENING_STARTED]: {
    label: "Matching against job post",
    percent: 75,
    progressStatus: "active",
  },
  [ScreeningStatus.SCREENING_FAILED]: {
    label: "Screening failed",
    percent: 75,
    progressStatus: "exception",
  },
  [ScreeningStatus.SCREENING_COMPLETED]: {
    label: "Completed",
    percent: 100,
    progressStatus: "success",
  },
};
