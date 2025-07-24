import { DeleteVisitor, PostAddVisitor } from "../services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";

export const useAddVisitor = () => {
  return useMutation({
    mutationFn: PostAddVisitor,
  });
};

export const useDeleteVisitor = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });

      showSnackbar({
        message: "Visitante deletado com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao deletar o visitante",
        severity: "error",
        duration: 3000,
      });
    },
  });
};
