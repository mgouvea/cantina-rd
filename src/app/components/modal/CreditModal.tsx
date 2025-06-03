"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import GenericModal from "./GenericModal";
import Text from "../ui/text/Text";
import {
  CircularProgress,
  Box,
  TextField,
  FormControl,
  FormLabel,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import { useAddCredit } from "@/hooks/mutations";
import { CreateCreditDto } from "@/types/credit";
import { useGroupFamilyWithOwner } from "@/hooks/queries";
import { GroupFamilyWithOwner } from "@/types/groupFamily";

type CreditModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  onConfirmCredit?: (data: CreateCreditDto) => Promise<void>;
};

export const CreditModal: React.FC<CreditModalProps> = ({
  openModal,
  setOpenModal,
  onConfirmCredit,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutateAsync: addCredit } = useAddCredit();
  const { data: groupFamilies, isLoading: isLoadingGroupFamilies } =
    useGroupFamilyWithOwner();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateCreditDto>({
    defaultValues: {
      creditedAmount: undefined as unknown as number,
      amount: undefined as unknown as number,
      groupFamilyId: "",
    },
    mode: "onChange",
  });

  // Watch creditedAmount to sync with amount
  const creditedAmount = watch("creditedAmount");

  // Sync amount with creditedAmount when creditedAmount changes
  useEffect(() => {
    setValue("amount", creditedAmount);
  }, [creditedAmount, setValue]);

  const onSubmit = async (data: CreateCreditDto) => {
    setIsProcessing(true);
    const creditPayload = {
      amount:
        typeof data.amount === "string" ? parseFloat(data.amount) : data.amount,
      creditedAmount:
        typeof data.creditedAmount === "string"
          ? parseFloat(data.creditedAmount)
          : data.creditedAmount,
      groupFamilyId: data.groupFamilyId,
    };
    try {
      if (onConfirmCredit) {
        await onConfirmCredit(creditPayload);
      } else {
        await addCredit(creditPayload);
      }

      reset();
      setOpenModal(false);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error adding credit:", error);
      setIsProcessing(false);
    }
  };

  return (
    <GenericModal
      title="Inserir Crédito"
      open={openModal}
      handleClose={() => {
        if (!isProcessing) {
          reset();
          setOpenModal(false);
        }
      }}
      cancelButtonText="Cancelar"
      confirmButtonText={isProcessing ? "Processando..." : "Confirmar"}
      disableConfirmButton={
        isProcessing ||
        !isValid ||
        !watch("groupFamilyId") ||
        !watch("creditedAmount")
      }
      buttonColor={"success"}
      handleConfirm={handleSubmit(onSubmit)}
    >
      <Box component="form" noValidate sx={{ mb: 2 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend">Grupo Familiar</FormLabel>
          <Controller
            name="groupFamilyId"
            control={control}
            rules={{ required: "Selecione um grupo familiar" }}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                error={!!errors.groupFamilyId}
                sx={{ mt: 1 }}
                disabled={isLoadingGroupFamilies}
              >
                <MenuItem value="" disabled>
                  {isLoadingGroupFamilies
                    ? "Carregando..."
                    : "Selecione um grupo familiar"}
                </MenuItem>
                {groupFamilies?.map((group: GroupFamilyWithOwner) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.ownerName || "Grupo sem proprietário"} - {group.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.groupFamilyId && (
            <Text variant="caption" color="error">
              {errors.groupFamilyId.message}
            </Text>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend">Valor total a ser creditado</FormLabel>
          <Controller
            name="creditedAmount"
            control={control}
            rules={{
              required: "Valor do crédito é obrigatório",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Valor inválido",
              },
              validate: (value) => {
                const numValue =
                  typeof value === "string" ? parseFloat(value) : value;
                if (numValue <= 0) return "Valor deve ser maior que zero";
                return true;
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                fullWidth
                type="number"
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                error={!!errors.creditedAmount}
                helperText={errors.creditedAmount?.message}
                sx={{ mt: 1 }}
              />
            )}
          />
        </FormControl>

        {isProcessing && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} color="success" />
          </Box>
        )}
      </Box>
    </GenericModal>
  );
};
