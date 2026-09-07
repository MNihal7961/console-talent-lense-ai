import apiClient from "./api.client.service";
import type {
  JobApplication,
  JobApplicationStatus,
} from "../interface/job-application";

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

  async updateApplicationStatus(
    id: string,
    status: JobApplicationStatus,
  ): Promise<JobApplication> {
    const response = await apiClient.patch(`/job-application/${id}/status`, {
      status,
    });
    return response.data;
  }
}

const jobApplicationService = new JobApplicationService();

export default jobApplicationService;
