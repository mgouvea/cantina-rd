import { useMutation } from "@tanstack/react-query";
import { DeleteProduct, PostAddProduct, UpdateProduct } from "@/hooks/services";

export const useAddProduct = () => {
  return useMutation({
    mutationFn: PostAddProduct,
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: UpdateProduct,
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: DeleteProduct,
  });
};
