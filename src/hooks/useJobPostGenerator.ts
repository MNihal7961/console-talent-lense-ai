import { useState } from "react";
import type { GeneratedJobPost } from "../interface/job-post";
import jobPostService from "../services/job.post.service";

const useJobPostGenerator = () => {
  const [generatedJobPost, setGeneratedJobPost] =
    useState<GeneratedJobPost | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateJobPost = async (message: string) => {
    try {
      setIsGenerating(true);
      const response = await jobPostService.generateJobPost(message);
      setGeneratedJobPost(response);
      return response;
    } catch (error: any) {
      console.log("useJobPostGenerator ~ generateJobPost ~ error:", error);
      setGeneratedJobPost(null);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatedJobPost,
    isGenerating,
    generateJobPost,
  };
};

export default useJobPostGenerator;
