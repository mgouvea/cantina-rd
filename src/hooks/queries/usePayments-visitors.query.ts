import { useQuery } from "@tanstack/react-query";
import { GetVisitorPayments } from "../services";

export const usePaymentsVisitors = () => {
  return useQuery({
    queryKey: ["payments-visitors"],
    queryFn: () => GetVisitorPayments(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
