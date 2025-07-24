import { useQuery } from "@tanstack/react-query";
import { GetInvoiceVisitors } from "../services";

export const useInvoicesVisitors = () => {
  return useQuery({
    queryKey: ["invoices-visitors"],
    queryFn: () => GetInvoiceVisitors(),
    retry: 1,
  });
};
