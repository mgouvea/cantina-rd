import { DeleteProduct, PostAddProduct, UpdateProduct } from "@/hooks/services";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: PostAddProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSnackbar({
        message: "Produto cadastrado com sucesso!",
        severity: "success",
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao cadastrar o produto";

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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: UpdateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSnackbar({
        message: "Produto editado com sucesso!",
        severity: "success",
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Erro ao editar o produto";

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

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      showSnackbar({
        message: "Produto deletado com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao deletar o produto",
        severity: "error",
        duration: 3000,
      });
    },
  });
};
