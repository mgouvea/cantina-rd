"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { useAddCredit, useAddDebit } from "@/hooks/mutations";
import { CreateCreditDto } from "@/types/credit";
import { useGroupFamilyWithOwner } from "@/hooks/queries";
import { GroupFamilyWithOwner } from "@/types/groupFamily";

type CreditModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

export const CreditModal: React.FC<CreditModalProps> = ({
  openModal,
  setOpenModal,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: groupFamilies } = useGroupFamilyWithOwner();

  const { mutateAsync: addCredit } = useAddCredit();
  const { mutateAsync: addDebit } = useAddDebit();

  const [typeOperation, setTypeOperation] = useState<"credit" | "debit">(
    "credit"
  );

  const [selectedFamily, setSelectedFamily] =
    useState<GroupFamilyWithOwner | null>(null);

  // Use useMemo to prevent defaultValues from being recreated on every render
  const defaultValues = useMemo(
    () => ({
      creditedAmount: undefined as unknown as number,
      amount: undefined as unknown as number,
      groupFamilyId: "",
    }),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateCreditDto>({
    defaultValues,
    mode: "onChange",
  });

  const creditedAmount = watch("creditedAmount");

  const handleFormReset = useCallback(() => {
    reset(defaultValues);
    setSelectedFamily(null);
    setTypeOperation("credit");
  }, [reset, defaultValues, setSelectedFamily, setTypeOperation]);

  // Reset form when modal is closed or opened
  useEffect(() => {
    if (openModal) {
      handleFormReset();
    }
  }, [openModal, handleFormReset]);

  // Sync amount with creditedAmount
  useEffect(() => {
    setValue("amount", creditedAmount);
  }, [creditedAmount, setValue]);

  const onSubmit = async (data: CreateCreditDto) => {
    setIsProcessing(true);

    try {
      if (typeOperation === "credit") {
        const creditPayload = {
          amount:
            typeof data.amount === "string"
              ? parseFloat(data.amount)
              : data.amount,
          creditedAmount:
            typeof data.creditedAmount === "string"
              ? parseFloat(data.creditedAmount)
              : data.creditedAmount,
          groupFamilyId: data.groupFamilyId,
        };

        await addCredit(creditPayload);
      }

      if (typeOperation === "debit") {
        const debitPayload = {
          amount:
            typeof data.amount === "string"
              ? parseFloat(data.amount)
              : data.amount,
          groupFamilyId: data.groupFamilyId,
        };

        await addDebit(debitPayload);
      }

      // Complete reset of the form
      handleFormReset();
      setOpenModal(false);
    } catch (error) {
      console.error("Error processing operation:", error);
    } finally {
      setIsProcessing(false);
      setTypeOperation("credit");
    }
  };

  return (
    <GenericModal
      title={typeOperation === "credit" ? "Inserir Crédito" : "Inserir Débito"}
      open={openModal}
      handleClose={() => {
        if (!isProcessing) {
          handleFormReset();
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
      buttonColor={typeOperation === "credit" ? "success" : "error"}
      handleConfirm={handleSubmit(onSubmit)}
    >
      <Box component="form" noValidate sx={{ mb: 2 }}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Tipo</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={typeOperation}
            name="radio-buttons-group"
            onChange={(e) =>
              setTypeOperation(e.target.value as "credit" | "debit")
            }
          >
            <FormControlLabel
              value="credit"
              control={<Radio />}
              label="Crédito"
            />
            <FormControlLabel
              value="debit"
              control={<Radio />}
              label="Débito"
            />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth sx={{ my: 3 }}>
          <Autocomplete
            id={`buyer-select`}
            options={groupFamilies || []}
            autoHighlight
            getOptionLabel={(option) => option.name}
            value={selectedFamily}
            onChange={(event, newValue) => {
              setSelectedFamily(newValue);
              if (!newValue) {
                setValue(`groupFamilyId`, "");
                return;
              }
              setValue(`groupFamilyId`, newValue._id!);
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{ "& > img": { flexShrink: 0 } }}
                  {...optionProps}
                  value={option._id}
                >
                  <Avatar src={option.ownerAvatar} alt={option.ownerName} />
                  <Text variant="subtitle1" sx={{ ml: 2 }}>
                    {option.name}
                  </Text>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Grupo Familiar"
                size="small"
                slotProps={{
                  htmlInput: {
                    ...params.inputProps,
                    autoComplete: "new-password",
                  },
                }}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel component="legend">
            {typeOperation === "credit"
              ? "Valor a ser creditado"
              : "Valor a ser debitado"}
          </FormLabel>
          <Controller
            name="creditedAmount"
            control={control}
            rules={{
              required:
                typeOperation === "credit"
                  ? "Valor do crédito é obrigatório"
                  : "Valor do débito é obrigatório",
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
                key={`creditedAmount-field-${openModal}`} // Force re-render when modal opens/closes
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                placeholder="0.00"
                value={field.value || ""} // Ensure empty string when value is undefined
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
