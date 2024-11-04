import { PostAddUser } from '@/services';
import { useMutation } from '@tanstack/react-query';

export const useAddUser = () => {
  return useMutation({
    mutationFn: PostAddUser,
  });
};
