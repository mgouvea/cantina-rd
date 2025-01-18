import { PostAddAdmin, PostAddUser, UpdateUser } from '@/services';
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

export const useAddAdmin = () => {
  return useMutation({
    mutationFn: PostAddAdmin,
  });
};
