import { GetClientes } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useClient = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => GetClientes(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
