import { useQuery } from "@tanstack/react-query";
import { GetPayments } from "../services";

export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => GetPayments(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
