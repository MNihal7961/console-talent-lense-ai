import apiClient from "./api.client.service";
import type { GeneratedJobPost, JobPost } from "../interface/job-post";

export class JobPostService {
  async getJobPosts(): Promise<JobPost[]> {
    const response = await apiClient.get("/job-post");
    return response.data || [];
  }

  async findJobPostById(jobPostId: string): Promise<JobPost | null> {
    const response = await apiClient.get(`/job-post/${jobPostId}`);
    return response.data || null;
  }

  async generateJobPost(message: string): Promise<GeneratedJobPost> {
    const response = await apiClient.post("/job-post/generate", { message });
    return response.data;
  }
}

const jobPostService = new JobPostService();

export default jobPostService;
