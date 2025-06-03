import { useSnackbar } from "@/app/components";
import { DeleteVisitor, PostAddVisitor } from "@/hooks/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
