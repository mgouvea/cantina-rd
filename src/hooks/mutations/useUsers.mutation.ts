import {
  DeleteAdminByUserId,
  DeleteUser,
  PostAddAdmin,
  PostAddUser,
  UpdateUser,
  UpdateUserGroupFamily,
} from "@/hooks/services";
import { useMutation } from "@tanstack/react-query";

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
  return useMutation({
    mutationFn: DeleteUser,
  });
};

export const useUpdateUsersGroupFamily = () => {
  return useMutation({
    mutationFn: UpdateUserGroupFamily,
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
