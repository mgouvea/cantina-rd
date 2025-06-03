import { useMutation } from "@tanstack/react-query";
import {
  CreateInvoice,
  DeleteInvoice,
  GetFullInvoice,
  SendInvoiceByWhatsApp,
} from "../services";
import { useQueryClient } from "@tanstack/react-query";

export const useFullInvoices = () => {
  return useMutation({
    mutationFn: GetFullInvoice,
  });
};

export const useAddInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};

export const useDeleteInvoice = () => {
  return useMutation({
    mutationFn: DeleteInvoice,
  });
};

export const useSendInvoiceByWhatsApp = () => {
  return useMutation({
    mutationFn: SendInvoiceByWhatsApp,
  });
};
