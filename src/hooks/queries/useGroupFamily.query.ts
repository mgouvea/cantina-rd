import { GetAllGroupFamilies } from "@/hooks/services/groupFamily";
import { useQuery } from "@tanstack/react-query";

export const useGroupFamily = () => {
  return useQuery({
    queryKey: ["groupFamily"],
    queryFn: () => GetAllGroupFamilies(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time (formerly cacheTime)
  });
};
