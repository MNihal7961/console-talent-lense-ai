import { useState } from "react";
import type {
  JobApplication,
  JobApplicationStatus,
} from "../interface/job-application";
import jobApplicationService from "../services/job.application.service";

const useJobApplicationStatusUpdate = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const updateStatus = async (
    jobApplicationId: string,
    status: JobApplicationStatus,
  ): Promise<JobApplication> => {
    try {
      setIsUpdating(true);
      return await jobApplicationService.updateApplicationStatus(
        jobApplicationId,
        status,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateStatus,
  };
};

export default useJobApplicationStatusUpdate;
