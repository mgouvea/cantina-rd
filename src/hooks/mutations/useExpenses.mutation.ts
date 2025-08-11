import { CreateExpenseDto, Expense } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";
import {
  DeleteExpenseById,
  PostAddExpense,
  UpdateExpenseById,
} from "../services";

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => PostAddExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      showSnackbar({
        message: "Despesa cadastrada com sucesso!",
        severity: "success",
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao cadastrar a despesa",
        severity: "error",
      });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ expenseId, data }: { expenseId: string; data: Expense }) =>
      UpdateExpenseById(expenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      showSnackbar({
        message: "Despesa atualizada com sucesso!",
        severity: "success",
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao atualizar a despesa",
        severity: "error",
      });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => DeleteExpenseById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      showSnackbar({
        message: "Despesa deletada com sucesso!",
        severity: "success",
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao deletar a despesa",
        severity: "error",
      });
    },
  });
};
