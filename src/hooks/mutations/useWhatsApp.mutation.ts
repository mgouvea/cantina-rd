import { useMutation } from "@tanstack/react-query";
import { GenerateNewQRCode } from "../services";

export const useGenerateNewQRCode = () => {
  return useMutation({
    mutationFn: GenerateNewQRCode,
  });
};
