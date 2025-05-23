import { useQuery } from "@tanstack/react-query";
import { GetCurrentQRCode } from "../services";

export const useCurrentQRCode = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["current-qrcode"],
    queryFn: () => GetCurrentQRCode(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
    enabled,
  });
};
