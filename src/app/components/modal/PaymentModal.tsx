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

type PaymentType = "total" | "partial" | "over";

type PaymentFormData = {
  paymentType: PaymentType;
  partialValue: string;
};

type PaymentModalProps = {
  openModal: boolean;
  ownerName?: string;
  invoiceValue?: number; // Valor total da fatura
  paidAmount?: number; // Valor já pago da fatura
  setOpenModal: (open: boolean) => void;
  onConfirmPayment: (paymentData: {
    paymentType: PaymentType;
    partialValue?: number;
    baseAmount?: number; // Valor de referência (total ou restante) para o modo 'over'
  }) => Promise<void>;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  ownerName,
  openModal,
  invoiceValue = 0,
  paidAmount = 0,
  setOpenModal,
  onConfirmPayment,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
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

  // Resetar o formulário quando o modal for fechado
  useEffect(() => {
    if (!openModal) {
      reset({
        paymentType: "total",
        partialValue: "",
      });
    }
  }, [openModal, reset]);

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    try {
      // Chamando a função de pagamento e aguardando sua conclusão
      await onConfirmPayment({
        paymentType: data.paymentType,
        partialValue:
          data.paymentType === "partial" || data.paymentType === "over"
            ? parseFloat(data.partialValue)
            : data.paymentType === "total" && paidAmount > 0
            ? remainingAmount // Se for pagamento total e já tiver pago algo, envia o valor restante
            : undefined, // Se for pagamento total sem pagamento anterior, envia undefined
        baseAmount:
          data.paymentType === "over"
            ? paidAmount > 0
              ? remainingAmount // base é o restante se já houve pagamento
              : invoiceValue // base é o total se não houve pagamento
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

  // Calcular o valor restante a ser pago
  const remainingAmount = invoiceValue - paidAmount;

  // Formatar os valores para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formattedInvoiceValue = formatCurrency(invoiceValue);
  const formattedPaidAmount = formatCurrency(paidAmount);
  const formattedRemainingAmount = formatCurrency(remainingAmount);

  return (
    <GenericModal
      title={`Confirmar pagamento de fatura${ownerName ? ` de ${ownerName}` : ""}`}
      open={openModal}
      handleClose={() => {
        if (!isProcessing) {
          setOpenModal(false);
          // Resetar o formulário ao fechar o modal
          reset({
            paymentType: "total",
            partialValue: "",
          });
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

        {paidAmount > 0 && (
          <>
            <Text variant="subtitle1" color="success.main" sx={{ mb: 1 }}>
              Valor já pago: {formattedPaidAmount}
            </Text>
            <Text variant="subtitle1" color="error.main" sx={{ mb: 2 }}>
              Valor restante a pagar: {formattedRemainingAmount}
            </Text>
          </>
        )}

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
                  label={
                    paidAmount > 0
                      ? `Pagamento do valor restante (${formattedRemainingAmount})`
                      : "Pagamento total da fatura"
                  }
                />
                <FormControlLabel
                  value="partial"
                  control={<Radio />}
                  label="Pagamento parcial da fatura"
                />
                <FormControlLabel
                  value="over"
                  control={<Radio />}
                  label={
                    paidAmount > 0
                      ? `Pagamento acima do valor restante (${formattedRemainingAmount})`
                      : "Pagamento acima do valor total"
                  }
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
                if (numValue >= remainingAmount)
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
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                error={!!errors.partialValue}
                helperText={errors.partialValue?.message}
                sx={{ mt: 1 }}
              />
            )}
          />
        )}

        {paymentType === "over" && (
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
                const threshold = paidAmount > 0 ? remainingAmount : invoiceValue;
                if (numValue <= threshold)
                  return paidAmount > 0
                    ? `O valor deve ser maior que ${formattedRemainingAmount}`
                    : `O valor deve ser maior que ${formattedInvoiceValue}`;
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
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
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
