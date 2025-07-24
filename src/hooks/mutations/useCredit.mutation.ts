import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCredit, CreateDebit } from "../services";
import { CreateCreditDto, CreateDebitDto } from "@/types/credit";
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
