import { useMutation } from "@tanstack/react-query";
import {
  CreateInvoice,
  DeleteInvoice,
  GetFullInvoice,
  SendInvoiceByWhatsApp,
} from "../services";

export const useFullInvoices = () => {
  return useMutation({
    mutationFn: GetFullInvoice,
  });
};

export const useAddInvoice = () => {
  return useMutation({
    mutationFn: CreateInvoice,
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
