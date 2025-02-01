import { GetCategories, GetSubCategories } from "@/services/categories";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
    return useQuery({
      queryKey: ['categories'],
      queryFn: () => GetCategories(),
    });
  };

export const useSubCategories = () => {
    return useQuery({
      queryKey: ['subCategories'],
      queryFn: () => GetSubCategories(),
    });
  };
  