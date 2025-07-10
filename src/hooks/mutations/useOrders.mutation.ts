import { useMutation } from "@tanstack/react-query";
import {
  DeleteOrder,
  DeleteOrderVisitor,
  PostAddManyOrders,
} from "../services";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";

// START Orders Socios ***************************************************************************
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

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      showSnackbar({
        message: "Compra deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao deletar a compra";

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
// END Orders Socios **************************************************************************

// START Orders Visitantes **************************************************************************
export const useDeleteOrderVisitor = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteOrderVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-visitors"] });

      showSnackbar({
        message: "Compra deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao deletar a compra";

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
// END Orders Visitantes **************************************************************************
