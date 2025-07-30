import {
  GetAllVisitors,
  GetAllVisitorsWithoutDateFilter,
} from "@/hooks/services";
import { useQuery } from "@tanstack/react-query";

export const useVisitors = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["visitors"],
    queryFn: () => GetAllVisitors(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time (formerly cacheTime)
    enabled,
  });
};

export const useVisitorsWithoutDateFilter = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["visitors-without-date-filter"],
    queryFn: () => GetAllVisitorsWithoutDateFilter(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time (formerly cacheTime)
    enabled,
  });
};
