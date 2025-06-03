import { useSnackbar } from "@/app/components";
import {
  DeleteAdminByUserId,
  DeleteUser,
  PostAddAdmin,
  PostAddUser,
  UpdateUser,
  UpdateUserFromGroupFamily,
} from "@/hooks/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddUser = () => {
  return useMutation({
    mutationFn: PostAddUser,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: UpdateUser,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      showSnackbar({
        message: "Sócio deletado com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao deletar o sócio",
        severity: "error",
        duration: 3000,
      });
    },
  });
};

export const useUpdateUsersGroupFamily = () => {
  return useMutation({
    mutationFn: UpdateUserFromGroupFamily,
  });
};

export const useAddAdmin = () => {
  return useMutation({
    mutationFn: PostAddAdmin,
  });
};

export const useDeleteAdmin = () => {
  return useMutation({
    mutationFn: DeleteAdminByUserId,
  });
};
