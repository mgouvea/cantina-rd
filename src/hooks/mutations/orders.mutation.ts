import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";
import { PostAddManyOrders } from "../services";

export const useAddManyOrders = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: PostAddManyOrders,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      showSnackbar({
        message: `Compras cadastradas com sucesso!`,
        severity: "success",
      });
    },
    onError: () => {
      showSnackbar({
        message: `Erro ao cadastrar as compras`,
        severity: "error",
      });
    },
  });
};
