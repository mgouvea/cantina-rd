import { useQuery } from "@tanstack/react-query";
import { GetActiveCredits, GetArchiveCredits, GetGroupFamilyCredits } from "../services/credits";
import type { Credit } from "@/types/credit";

export const useCredits = (archive: boolean = false) => {
  return useQuery({
    queryKey: ["credits", { archive }],
    queryFn: () => (archive ? GetArchiveCredits() : GetActiveCredits()),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useGetGroupFamilyCredits = (groupFamilyId?: string) => {
  return useQuery<Credit[]>({
    queryKey: ["group-family-credits", groupFamilyId],
    queryFn: () => GetGroupFamilyCredits(groupFamilyId!),
    enabled: !!groupFamilyId,
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
    initialData: [],
  });
};
