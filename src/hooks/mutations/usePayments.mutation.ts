import { useMutation } from "@tanstack/react-query";
import { CreatePayment } from "../services";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: CreatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });

      showSnackbar({
        message: "Pagamento confirmado com sucesso!",
        severity: "success",
        duration: 3000,
      });
    },
    onError: () => {
      showSnackbar({
        message: "Erro ao confirmar pagamento",
        severity: "error",
        duration: 3000,
      });
    },
  });
};
