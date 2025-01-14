import { PostAddGroupFamily } from '@/services/groupFamily';
import { useMutation } from '@tanstack/react-query';

export const useAddGroupFamily = () => {
  return useMutation({
    mutationFn: PostAddGroupFamily,
  });
};
