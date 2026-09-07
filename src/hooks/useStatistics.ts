import { useCallback, useEffect, useState } from "react";
import type { DashboardStatistics } from "../interface/statistics";
import statisticsService from "../services/statistics.service";

const useStatistics = () => {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(
    null,
  );
  const [isStatisticsLoading, setIsStatisticsLoading] =
    useState<boolean>(false);

  const loadStatistics = useCallback(async () => {
    try {
      setIsStatisticsLoading(true);
      const response = await statisticsService.getStatistics();
      setStatistics(response);
    } catch (error: any) {
      console.log("useStatistics ~ loadStatistics ~ error:", error);
      setStatistics(null);
    } finally {
      setIsStatisticsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return {
    statistics,
    isStatisticsLoading,
  };
};

export default useStatistics;
