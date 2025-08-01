import { useQuery } from "@tanstack/react-query";
import { GetActiveCredits, GetArchiveCredits } from "../services/credits";

export const useCredits = (archive: boolean = false) => {
  return useQuery({
    queryKey: ["credits", { archive }],
    queryFn: () => (archive ? GetArchiveCredits() : GetActiveCredits()),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
