import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/components";
import { CreateVisitorPayment } from "../services";

export const useAddPaymentVisitors = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: CreateVisitorPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices-visitors"] });
      queryClient.invalidateQueries({ queryKey: ["payments-visitors"] });

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
