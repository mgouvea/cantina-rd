import { GetAllAdmins, GetAllUsers, GetUserById } from "@/hooks/services";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUsers(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time (formerly cacheTime)
    enabled,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["usersId", id],
    queryFn: () => GetUserById(id),
  });
};

export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () => GetAllAdmins(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time (formerly cacheTime)
  });
};
