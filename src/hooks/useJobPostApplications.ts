import { useCallback, useEffect, useState } from "react";
import { ScreeningStatus, type JobApplication } from "../interface/job-application";
import type { ScreeningResult } from "../interface/screening-result";
import jobApplicationService from "../services/job.application.service";
import screeningService from "../services/screening.service";

export interface JobPostApplicationRow {
  jobApplication: JobApplication;
  screeningResult: ScreeningResult | null;
  rank: number | null;
}

const useJobPostApplications = (jobPostId?: string) => {
  const [applications, setApplications] = useState<JobPostApplicationRow[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadApplications = useCallback(async () => {
    if (!jobPostId) return;

    setIsLoading(true);

    const jobApplications = await jobApplicationService
      .getJobApplicationsByJobPost(jobPostId)
      .catch(() => []);

    const completed = jobApplications.filter(
      (jobApplication) =>
        jobApplication.screeningStatus === ScreeningStatus.SCREENING_COMPLETED,
    );
    const pending = jobApplications.filter(
      (jobApplication) =>
        jobApplication.screeningStatus !== ScreeningStatus.SCREENING_COMPLETED,
    );

    const completedResults = await Promise.all(
      completed.map(async (jobApplication) => {
        const screeningResult = await screeningService
          .getScreeningResult(jobApplication._id)
          .catch(() => null);
        return { jobApplication, screeningResult };
      }),
    );

    const rankedCompleted: JobPostApplicationRow[] = completedResults
      .filter(
        (entry): entry is { jobApplication: JobApplication; screeningResult: ScreeningResult } =>
          entry.screeningResult !== null,
      )
      .sort((a, b) => b.screeningResult.matchScore - a.screeningResult.matchScore)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    const unrankedCompleted: JobPostApplicationRow[] = completedResults
      .filter((entry) => entry.screeningResult === null)
      .map((entry) => ({
        jobApplication: entry.jobApplication,
        screeningResult: null,
        rank: null,
      }));

    const pendingRows: JobPostApplicationRow[] = pending.map(
      (jobApplication) => ({
        jobApplication,
        screeningResult: null,
        rank: null,
      }),
    );

    setApplications([...rankedCompleted, ...unrankedCompleted, ...pendingRows]);
    setIsLoading(false);
  }, [jobPostId]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return {
    applications,
    isLoading,
    reloadApplications: loadApplications,
  };
};

export default useJobPostApplications;
