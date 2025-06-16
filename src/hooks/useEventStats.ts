import { useQuery } from "@tanstack/react-query";
import { eventApi } from "../services/api";
import { ChartData } from "../types/event";

export const useEventStats = () => {
  const query = useQuery({
    queryKey: ["eventStats"],
    queryFn: eventApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });

  const chartData: ChartData[] =
    query.data?.eventTypes.map((type) => ({
      name: type.category,
      value: type.total,
    })) || [];

  return {
    ...query,
    chartData,
  };
};
