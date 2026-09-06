import { useCallback, useState } from "react";
import type { JobPost } from "../interface/job-post";
import jobPostService from "../services/job.post.service";

const useJobPost = () => {
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [isJobPostLoading, setIsJobPostLoading] = useState<boolean>(false);

  const loadJobPostDetails = useCallback(async (jobPostId: string) => {
    try {
      setIsJobPostLoading(true);
      const response = await jobPostService.findJobPostById(jobPostId);
      setJobPost(response);
    } catch (error: any) {
      console.log("useJobPost ~ loadJobPostDetails ~ error:", error);
      setJobPost(null);
    } finally {
      setIsJobPostLoading(false);
    }
  }, []);

  return {
    jobPost,
    isJobPostLoading,
    loadJobPostDetails,
  };
};

export default useJobPost;
