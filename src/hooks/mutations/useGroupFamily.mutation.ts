import { useSnackbar } from "@/app/components";
import {
  AddMember,
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

export const useRemoveMemberFromGroupFamily = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: RemoveMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupFamily"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar({
        message: `Membros removidos com sucesso!`,
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: `Erro ao remover membros`,
        severity: "error",
        duration: 3000,
      });
    },
  });
};

export const useAddMemberToGroupFamily = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: AddMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupFamily"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar({
        message: `Membros adicionados com sucesso!`,
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: `Erro ao adicionar membros`,
        severity: "error",
        duration: 3000,
      });
    },
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
