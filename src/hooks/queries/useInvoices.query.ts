import { useQuery } from "@tanstack/react-query";
import { GetInvoice } from "../services";

export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => GetInvoice(),
    retry: 1,
  });
};
