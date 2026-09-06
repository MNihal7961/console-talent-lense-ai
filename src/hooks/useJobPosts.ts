import { useCallback, useEffect, useState } from "react";
import type { JobPost } from "../interface/job-post";
import jobPostService from "../services/job.post.service";

const useJobPosts = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [isJobPostLoading, setIsJobPostLoading] = useState<boolean>(false);

  const loadJobPosts = useCallback(async () => {
    try {
      setIsJobPostLoading(true);
      const response = await jobPostService.getJobPosts();
      setJobPosts(response);
    } catch (error: any) {
      console.log("useJobPosts ~ loadJobPosts ~ error:", error);
      setJobPosts([]);
    } finally {
      setIsJobPostLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobPosts();
  }, [loadJobPosts]);

  return {
    jobPosts,
    isJobPostLoading,
  };
};

export default useJobPosts;
