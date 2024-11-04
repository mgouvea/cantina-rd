import {
  GetAdmins,
  GetAllUsers,
  GetGroupFamily,
  GetUserById,
} from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => GetAllUsers(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => GetUserById(id),
  });
};

export const useAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: () => GetAdmins(true),
  });
};

export const useGroupFamily = (groupFamily: string) => {
  return useQuery({
    queryKey: ['groupFamily', groupFamily],
    queryFn: () => GetGroupFamily(groupFamily),
  });
};
