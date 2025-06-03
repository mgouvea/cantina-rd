import { useMutation } from "@tanstack/react-query";
import {
  DeleteCategory,
  DeleteSubCategory,
  PostAddCategories,
  PostAddSubCategories,
  UpdateCategory,
  UpdateSubCategory,
} from "@/hooks/services";
import { useCategoryStore } from "@/contexts";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { isEditing } = useCategoryStore();

  return useMutation({
    mutationFn: PostAddCategories,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showSnackbar({
        message: `Categoria ${
          isEditing ? "editada" : "cadastrada"
        } com sucesso!`,
        severity: "success",
      });
    },
    onError: () => {
      showSnackbar({
        message: `Erro ao ${isEditing ? "editar" : "cadastrar"} a categoria`,
        severity: "error",
      });
    },
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
