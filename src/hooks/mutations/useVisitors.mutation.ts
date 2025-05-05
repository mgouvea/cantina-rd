import { DeleteVisitor, PostAddVisitor } from "@/hooks/services";
import { useMutation } from "@tanstack/react-query";

export const useAddVisitor = () => {
  return useMutation({
    mutationFn: PostAddVisitor,
  });
};

export const useDeleteVisitor = () => {
  return useMutation({
    mutationFn: DeleteVisitor,
  });
};
