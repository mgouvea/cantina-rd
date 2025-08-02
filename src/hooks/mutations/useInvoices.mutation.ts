import { useMutation } from "@tanstack/react-query";
import {
  CreateInvoice,
  DeleteInvoice,
  GetFullInvoice,
  ResetWhatsAppInvoice,
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
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: CreateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });

      showSnackbar({
        message: "Fatura gerada com sucesso",
        severity: "success",
        duration: 3000,
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao gerar fatura";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      showSnackbar({
        message: errorMessage,
        severity: "error",
        duration: 5000,
      });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteInvoice,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      showSnackbar({
        message: "Fatura deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao deletar fatura";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      showSnackbar({
        message: errorMessage,
        severity: "error",
        duration: 3000,
      });
    },
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao enviar fatura";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      showSnackbar({
        message: errorMessage,
        severity: "error",
        duration: 3000,
      });
    },
  });
};

export const useResetWhatsAppInvoice = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ResetWhatsAppInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      showSnackbar({
        message: "Reenvio habilitado com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao habilitar reenvio";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      showSnackbar({
        message: errorMessage,
        severity: "error",
        duration: 3000,
      });
    },
  });
};
