import { useQuery } from "@tanstack/react-query";
import { GetAllOrders } from "../services";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => GetAllOrders(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time (formerly cacheTime)
  });
};
