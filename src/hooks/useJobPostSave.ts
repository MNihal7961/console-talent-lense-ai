import { useState } from "react";
import type { GeneratedJobPost, JobPost } from "../interface/job-post";
import jobPostService from "../services/job.post.service";

const useJobPostSave = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const saveJobPost = async (jobPost: GeneratedJobPost): Promise<JobPost> => {
    try {
      setIsSaving(true);
      return await jobPostService.saveJobPost(jobPost);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveJobPost,
  };
};

export default useJobPostSave;
