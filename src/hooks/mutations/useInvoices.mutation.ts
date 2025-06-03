import { useMutation } from "@tanstack/react-query";
import {
  CreateInvoice,
  DeleteInvoice,
  GetFullInvoice,
  SendInvoiceByWhatsApp,
} from "../services";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";

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
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: SendInvoiceByWhatsApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      showSnackbar({
        message: "Fatura enviada com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao enviar fatura",
        severity: "error",
        duration: 3000,
      });
    },
  });
};
