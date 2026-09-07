import apiClient from "./api.client.service";
import type { DashboardStatistics } from "../interface/statistics";

class StatisticsService {
  async getStatistics(): Promise<DashboardStatistics> {
    const response = await apiClient.get("/statistics");
    return response.data;
  }
}

const statisticsService = new StatisticsService();

export default statisticsService;
