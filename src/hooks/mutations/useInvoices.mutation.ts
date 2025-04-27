import { useMutation } from "@tanstack/react-query";
import { GetFullInvoice } from "../services";

export const useFullInvoices = () => {
  return useMutation({
    mutationFn: GetFullInvoice,
  });
};
