import { useQuery } from "@tanstack/react-query";
import { GetCredits } from "../services/credits";

export const useCredits = () => {
  return useQuery({
    queryKey: ["credits"],
    queryFn: () => GetCredits(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
