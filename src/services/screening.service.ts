import apiClient from "./api.client.service";
import type { JobApplication } from "../interface/job-application";
import type { ScreeningResult } from "../interface/screening-result";

class ScreeningService {
  async screenResume(
    jobPostId: string,
    resume: File,
  ): Promise<JobApplication> {
    const formData = new FormData();
    formData.append("resume", resume);

    const response = await apiClient.post(
      `/screening/${jobPostId}`,
      formData,
    );
    return response.data;
  }

  async getScreeningResult(
    jobApplicationId: string,
  ): Promise<ScreeningResult | null> {
    const response = await apiClient.get(
      `/screening/result/${jobApplicationId}`,
    );
    return response.data || null;
  }
}

const screeningService = new ScreeningService();

export default screeningService;
