import { useCallback, useEffect, useState } from "react";
import type { JobApplication } from "../interface/job-application";
import jobApplicationService from "../services/job.application.service";

const useJobApplications = (jobPostId?: string) => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(
    [],
  );
  const [isJobApplicationsLoading, setIsJobApplicationsLoading] =
    useState<boolean>(false);

  const loadJobApplications = useCallback(async () => {
    if (!jobPostId) return;

    try {
      setIsJobApplicationsLoading(true);
      const response =
        await jobApplicationService.getJobApplicationsByJobPost(jobPostId);
      setJobApplications(response);
    } catch (error: any) {
      console.log("useJobApplications ~ loadJobApplications ~ error:", error);
      setJobApplications([]);
    } finally {
      setIsJobApplicationsLoading(false);
    }
  }, [jobPostId]);

  useEffect(() => {
    loadJobApplications();
  }, [loadJobApplications]);

  return {
    jobApplications,
    setJobApplications,
    isJobApplicationsLoading,
  };
};

export default useJobApplications;
