import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCredit, CreateDebit, DeleteCredit, SendCreditMessage } from "../services";
import { CreateCreditDto, CreateDebitDto, CreditMessage } from "@/types/credit";
import { useSnackbar } from "@/app/components";

export const useAddCredit = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreateCreditDto) => CreateCredit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      showSnackbar({
        message: "Crédito cadastrado com sucesso!",
        severity: "success",
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao cadastrar o crédito",
        severity: "error",
      });
    },
  });
};

export const useSendCreditMessage = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreditMessage) => SendCreditMessage(data),
    onSuccess: () => {
      showSnackbar({
        message: "Crédito enviado com sucesso!",
        severity: "success",
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao enviar o crédito",
        severity: "error",
      });
    },
  });
};

export const useAddDebit = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (debit: CreateDebitDto) => CreateDebit(debit),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debits"] });
      showSnackbar({
        message: "Débito cadastrado com sucesso!",
        severity: "success",
      });
    },

    onError: () => {
      showSnackbar({
        message: "Erro ao cadastrar o débito",
        severity: "error",
      });
    },
  });
};

export const useDeleteCredit = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteCredit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });

      showSnackbar({
        message: "Crédito deletado com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao deletar o crédito",
        severity: "error",
        duration: 3000,
      });
    },
  });
};
