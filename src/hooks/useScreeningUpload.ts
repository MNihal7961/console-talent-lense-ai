import { useState } from "react";
import type { JobApplication } from "../interface/job-application";
import screeningService from "../services/screening.service";

const useScreeningUpload = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const uploadResume = async (
    jobPostId: string,
    resume: File,
  ): Promise<JobApplication> => {
    try {
      setIsUploading(true);
      return await screeningService.screenResume(jobPostId, resume);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadResume,
  };
};

export default useScreeningUpload;
