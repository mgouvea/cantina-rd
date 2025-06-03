import { useMutation } from "@tanstack/react-query";
import {
  DeleteCategory,
  DeleteSubCategory,
  PostAddCategories,
  PostAddSubCategories,
  UpdateCategory,
  UpdateSubCategory,
} from "@/hooks/services";

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

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: UpdateCategory,
  });
};

export const useUpdateSubCategory = () => {
  return useMutation({
    mutationFn: UpdateSubCategory,
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: DeleteCategory,
  });
};

export const useDeleteSubCategory = () => {
  return useMutation({
    mutationFn: DeleteSubCategory,
  });
};
