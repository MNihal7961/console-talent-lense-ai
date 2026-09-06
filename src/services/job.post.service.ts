import apiClient from "./api.client.service";
import type { JobPost } from "../interface/job-post";

export class JobPostService {
  async getJobPosts(): Promise<JobPost[]> {
    const response = await apiClient.get("/job-post");
    return response.data || [];
  }

  async findJobPostById(jobPostId: string): Promise<JobPost | null> {
    const response = await apiClient.get(`/job-post/${jobPostId}`);
    return response.data || null;
  }
}

const jobPostService = new JobPostService();

export default jobPostService;
