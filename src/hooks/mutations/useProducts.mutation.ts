import { useMutation } from "@tanstack/react-query";
import { PostAddProduct } from "@/services";

export const useAddProduct = () => {
  return useMutation({
    mutationFn: PostAddProduct,
  });
};
