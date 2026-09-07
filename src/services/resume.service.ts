import apiClient from "./api.client.service";
import type { Resume } from "../interface/resume";

export class ResumeService {
  async findById(resumeId: string): Promise<Resume | null> {
    const response = await apiClient.get(`/resume/${resumeId}`);
    return response.data || null;
  }
}

const resumeService = new ResumeService();

export default resumeService;
