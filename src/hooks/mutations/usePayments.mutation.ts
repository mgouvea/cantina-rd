import { useMutation } from "@tanstack/react-query";
import { CreatePayment } from "../services";

export const useAddPayment = () => {
  return useMutation({
    mutationFn: CreatePayment,
  });
};
