import { GetProducts } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
    return useQuery({
      queryKey: ['products'],
      queryFn: () => GetProducts(),
      retry: 1,
    });
  };
  