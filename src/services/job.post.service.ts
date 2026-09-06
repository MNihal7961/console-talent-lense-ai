import apiClient from "./api.client.service";

export class JobPostService {
  async getJobPosts() {
    const response = await apiClient.get("/job-post");
    return response.data || [];
  }
}

const jobPostService = new JobPostService();

export default jobPostService;
