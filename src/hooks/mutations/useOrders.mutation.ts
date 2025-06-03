import { useMutation } from "@tanstack/react-query";
import { DeleteOrder } from "../services";

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: DeleteOrder,
  });
};
