import { useQuery } from "@tanstack/react-query";
import { CheckConnection, GetQRCode } from "../services";

export const useQRCode = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["qrcode"],
    queryFn: () => GetQRCode(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
    enabled,
  });
};

export const useCheckConnection = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["connection"],
    queryFn: () => CheckConnection(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
    enabled,
  });
};
