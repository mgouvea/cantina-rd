import { useSnackbar } from "@/app/components";
import {
  AddOrRemoveMember,
  DeleteGroupFamily,
  PostAddGroupFamily,
  RemoveMember,
  UpdateGroupFamily,
} from "@/hooks/services/groupFamily";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddGroupFamily = () => {
  return useMutation({
    mutationFn: PostAddGroupFamily,
  });
};

export const useUpdateGroupFamily = () => {
  return useMutation({
    mutationFn: UpdateGroupFamily,
  });
};

export const useUpdateMembersGroupFamily = () => {
  return useMutation({
    mutationFn: AddOrRemoveMember,
  });
};

export const useRemoveMemberFromGroupFamily = () => {
  return useMutation({
    mutationFn: RemoveMember,
  });
};

export const useDeleteGroupFamily = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: DeleteGroupFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupFamily"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      showSnackbar({
        message: "Grupo Familiar deletado com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao deletar grupo familiar",
        severity: "error",
        duration: 3000,
      });
    },
  });
};
