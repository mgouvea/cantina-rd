import { useMutation } from "@tanstack/react-query";
import { PostAddProduct } from "@/hooks/services";

export const useAddProduct = () => {
  return useMutation({
    mutationFn: PostAddProduct,
  });
};
