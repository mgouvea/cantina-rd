"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import GenericModal from "./GenericModal";
import Text from "../ui/text/Text";
import {
  CircularProgress,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  TextField,
  InputAdornment,
} from "@mui/material";

type PaymentType = "total" | "partial";

type PaymentFormData = {
  paymentType: PaymentType;
  partialValue: string;
};

type PaymentModalProps = {
  openModal: boolean;
  ownerName?: string;
  invoiceValue?: number; // Valor total da fatura
  setOpenModal: (open: boolean) => void;
  onConfirmPayment: (paymentData: {
    paymentType: PaymentType;
    partialValue?: number;
  }) => void;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  ownerName,
  openModal,
  invoiceValue = 0,
  setOpenModal,
  onConfirmPayment,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      paymentType: "total",
      partialValue: "",
    },
  });

  const paymentType = watch("paymentType");

  // Resetar o valor parcial quando mudar para pagamento total
  useEffect(() => {
    if (paymentType === "total") {
      setValue("partialValue", "");
    }
  }, [paymentType, setValue]);

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    try {
      // Chamando a função de pagamento e aguardando sua conclusão
      await onConfirmPayment({
        paymentType: data.paymentType,
        partialValue:
          data.paymentType === "partial"
            ? parseFloat(data.partialValue)
            : undefined,
      });

      // Só fecha o modal após a conclusão bem-sucedida
      setOpenModal(false);
    } catch (error) {
      // Em caso de erro, mantém o modal aberto para que o usuário possa tentar novamente
      console.error("Erro ao processar pagamento:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Formatar o valor da fatura para exibição
  const formattedInvoiceValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(invoiceValue);

  return (
    <GenericModal
      title={`Confirmar pagamento de fatura${
        ownerName ? ` de ${ownerName}` : ""
      }`}
      open={openModal}
      handleClose={() => {
        if (!isProcessing) {
          setOpenModal(false);
        }
      }}
      cancelButtonText="Cancelar"
      confirmButtonText={isProcessing ? "Processando..." : "Confirmar"}
      buttonColor={"success"}
      handleConfirm={handleSubmit(onSubmit)}
    >
      <Box component="form" sx={{ mb: 2 }}>
        <Text variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
          Valor total da fatura: {formattedInvoiceValue}
        </Text>

        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <FormLabel component="legend">Tipo de pagamento</FormLabel>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} sx={{ mb: 2 }}>
                <FormControlLabel
                  value="total"
                  control={<Radio />}
                  label="Pagamento total da fatura"
                />
                <FormControlLabel
                  value="partial"
                  control={<Radio />}
                  label="Pagamento parcial da fatura"
                />
              </RadioGroup>
            )}
          />
        </FormControl>

        {paymentType === "partial" && (
          <Controller
            name="partialValue"
            control={control}
            rules={{
              required: "Valor do pagamento é obrigatório",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Valor inválido",
              },
              validate: (value) => {
                const numValue = parseFloat(value);
                if (numValue <= 0) return "Valor deve ser maior que zero";
                if (numValue >= invoiceValue)
                  return "Para pagamento total, selecione a opção acima";
                return true;
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Valor pago"
                variant="outlined"
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                error={!!errors.partialValue}
                helperText={errors.partialValue?.message}
                sx={{ mt: 1 }}
              />
            )}
          />
        )}

        {isProcessing && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} color="success" />
          </Box>
        )}
      </Box>
    </GenericModal>
  );
};
