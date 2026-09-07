import apiClient from "./api.client.service";
import type { JobApplication } from "../interface/job-application";

export class JobApplicationService {
  async getJobApplicationsByJobPost(
    jobPostId: string,
  ): Promise<JobApplication[]> {
    const response = await apiClient.get(
      `/job-application/job-post/${jobPostId}`,
    );
    return response.data || [];
  }

  async findApplicationById(id: string): Promise<JobApplication | null> {
    const response = await apiClient.get(`/job-application/${id}`);
    return response.data || null;
  }
}

const jobApplicationService = new JobApplicationService();

export default jobApplicationService;
