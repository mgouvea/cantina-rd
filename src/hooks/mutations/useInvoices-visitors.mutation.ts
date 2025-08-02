import { useMutation } from "@tanstack/react-query";
import {
  CreateInvoiceVisitors,
  DeleteInvoiceVisitors,
  GetFullInvoiceVisitors,
  ResetWhatsAppVisitorsInvoice,
  SendInvoiceVisitorsByWhatsApp,
} from "../services";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";

export const useFullInvoicesVisitors = () => {
  return useMutation({
    mutationFn: GetFullInvoiceVisitors,
  });
};

export const useAddInvoiceVisitors = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: CreateInvoiceVisitors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices-visitors"] });

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

export const useDeleteInvoiceVisitors = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteInvoiceVisitors,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices-visitors"] });
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

export const useSendInvoiceVisitorsByWhatsApp = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: SendInvoiceVisitorsByWhatsApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices-visitors"] });
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

export const useResetWhatsAppVisitorsInvoice = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ResetWhatsAppVisitorsInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices-visitors"] });
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
