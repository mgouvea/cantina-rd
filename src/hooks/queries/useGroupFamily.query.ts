import { GetAllGroupFamilies } from '@/services/groupFamily';
import { useQuery } from '@tanstack/react-query';

export const useGroupFamily = () => {
  return useQuery({
    queryKey: ['groupFamily'],
    queryFn: () => GetAllGroupFamilies(),
  });
};
