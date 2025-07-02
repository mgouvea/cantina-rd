import { useQuery } from "@tanstack/react-query";
import { GetTotalContents } from "../services/dashboard";

export const useTotalContents = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ["total-contents", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => GetTotalContents(startDate, endDate),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
