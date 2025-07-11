import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateInstance, RestartInstance } from "../services";

export const useCreateInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CreateInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connection"] });
    },
  });
};

export const useRestartInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RestartInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connection"] });
    },
  });
};
