import { PostAddCategories, PostAddSubCategories } from "@/services";
import { useMutation } from "@tanstack/react-query";

export const useAddCategory = () => {
  return useMutation({
    mutationFn: PostAddCategories,
  });
};

export const useAddSubCategory = () => {
  return useMutation({
    mutationFn: PostAddSubCategories,
  });
};
