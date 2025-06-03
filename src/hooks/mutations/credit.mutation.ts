import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCredit } from "../services";
import { CreateCreditDto } from "@/types/credit";

export const useAddCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCreditDto) => CreateCredit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};
