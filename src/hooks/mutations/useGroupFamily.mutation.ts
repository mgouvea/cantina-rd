import {
  AddMember,
  DeleteGroupFamily,
  PostAddGroupFamily,
  RemoveMember,
  UpdateGroupFamily,
} from "@/hooks/services/groupFamily";
import { useMutation } from "@tanstack/react-query";

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

export const useAddMemberToGroupFamily = () => {
  return useMutation({
    mutationFn: AddMember,
  });
};

export const useRemoveMemberFromGroupFamily = () => {
  return useMutation({
    mutationFn: RemoveMember,
  });
};

export const useDeleteGroupFamily = () => {
  return useMutation({
    mutationFn: DeleteGroupFamily,
  });
};
