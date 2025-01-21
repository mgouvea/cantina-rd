import { PostAddAdmin, PostAddUser, UpdateUser, UpdateUserGroupFamily,  } from '@/services';
import { useMutation } from '@tanstack/react-query';

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
