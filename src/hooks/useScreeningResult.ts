import { useCallback, useEffect, useState } from "react";
import type { JobApplication } from "../interface/job-application";
import type { JobPost } from "../interface/job-post";
import type { Resume } from "../interface/resume";
import type { ScreeningResult } from "../interface/screening-result";
import jobApplicationService from "../services/job.application.service";
import jobPostService from "../services/job.post.service";
import resumeService from "../services/resume.service";
import screeningService from "../services/screening.service";

const useScreeningResult = (jobApplicationId?: string) => {
  const [jobApplication, setJobApplication] = useState<JobApplication | null>(
    null,
  );
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [screeningResult, setScreeningResult] =
    useState<ScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadScreeningResult = useCallback(async () => {
    if (!jobApplicationId) return;

    setIsLoading(true);

    const application = await jobApplicationService
      .findApplicationById(jobApplicationId)
      .catch(() => null);
    setJobApplication(application);

    const [result, post, resumeData] = await Promise.all([
      screeningService.getScreeningResult(jobApplicationId).catch(() => null),
      application
        ? jobPostService
            .findJobPostById(String(application.jobPostId))
            .catch(() => null)
        : Promise.resolve(null),
      application?.resumeId
        ? resumeService.findById(String(application.resumeId)).catch(() => null)
        : Promise.resolve(null),
    ]);

    setScreeningResult(result);
    setJobPost(post);
    setResume(resumeData);
    setIsLoading(false);
  }, [jobApplicationId]);

  useEffect(() => {
    loadScreeningResult();
  }, [loadScreeningResult]);

  return {
    jobApplication,
    setJobApplication,
    jobPost,
    resume,
    screeningResult,
    isLoading,
    reloadScreeningResult: loadScreeningResult,
  };
};

export default useScreeningResult;
