import { useQuery } from "@tanstack/react-query";
import { GetAllExpenses } from "../services";

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => GetAllExpenses(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time (formerly cacheTime)
  });
};
