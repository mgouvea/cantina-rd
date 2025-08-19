"use client";

import GenericModal from "./GenericModal";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Text from "../ui/text/Text";
import { Controller, useForm } from "react-hook-form";
import { useUsers } from "@/hooks/queries";
import {
  CircularProgress,
  Box,
  TextField,
  FormControl,
  FormLabel,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  Autocomplete,
  Avatar,
  Grid,
} from "@mui/material";
import { UploadPicture } from "../ui/upload/UploadPicture";
import { CreateExpenseDto, User, Expense } from "@/types";
import { fotoUploadProps } from "@/types/products";
import Loading from "../loading/Loading";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import ptBR from "date-fns/locale/pt-BR";
import {
  useAddExpense,
  useUpdateExpense,
} from "@/hooks/mutations/useExpenses.mutation";

type ExpensesModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  expenseData?: Expense | null;
  isEditing?: boolean;
  onClose?: () => void;
};

const expenseType = [
  { value: "canteenCard", label: "Cartão Cantina" },
  { value: "canteenCredit", label: "Crédito Cantina" },
  { value: "paidByTreasurer", label: "Pagamento pelo Tesoureiro" },
  { value: "refund", label: "Reembolso" },
];

export const ExpensesModal: React.FC<ExpensesModalProps> = ({
  openModal,
  setOpenModal,
  expenseData = null,
  isEditing = false,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const { mutateAsync: addExpense } = useAddExpense();
  const { mutateAsync: updateExpense } = useUpdateExpense();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [fotoExpense, setFotoExpense] = useState<fotoUploadProps | null>(null);
  const [hovering, setHovering] = useState(false);

  // Use useMemo to prevent defaultValues from being recreated on every render
  const defaultValues = useMemo(() => {
    if (isEditing && expenseData) {
      console.log("Creating defaultValues for editing with data:", expenseData);
      return {
        userId: expenseData.userId || "",
        description: expenseData.description || "",
        expenseValue: expenseData.expenseValue || 0,
        expenseDate: expenseData.expenseDate
          ? new Date(expenseData.expenseDate)
          : null,
        referenceMonth: expenseData.referenceMonth
          ? new Date(expenseData.referenceMonth)
          : null,
        expenseType: expenseData.expenseType || "",
        urlImage: expenseData.urlImage || "",
        publicIdImage: expenseData.publicIdImage || "",
        _id: expenseData._id || "",
      };
    }
    return {
      userId: "",
      description: "",
      expenseValue: undefined as unknown as number,
      expenseDate: null as Date | null,
      referenceMonth: null as Date | null,
      expenseType: undefined,
      urlImage: "",
      publicIdImage: "",
    };
  }, [isEditing, expenseData]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<CreateExpenseDto>({
    defaultValues,
    mode: "onChange",
  });

  const handleFormReset = useCallback(() => {
    reset(defaultValues);
    setSelectedUser(null);
    setFotoExpense(null);
  }, [reset, defaultValues, setSelectedUser]);

  // The UploadPicture component handles file upload internally

  // Set selected user when editing
  useEffect(() => {
    if (isEditing && expenseData && users) {
      console.log("Editing expense data:", expenseData);
      const user = users.find((user: User) => user._id === expenseData.userId);
      if (user) {
        console.log("Found user:", user);
        setSelectedUser(user);
      } else {
        console.log("User not found for ID:", expenseData.userId);
        console.log("Available users:", users);
      }
    }
  }, [isEditing, expenseData, users]);

  // Set image when editing
  useEffect(() => {
    if (isEditing && expenseData && expenseData.urlImage) {
      // Create a valid fotoUploadProps object with required properties
      setFotoExpense({
        base64: expenseData.urlImage,
        name: "expense-image", // Providing a default name
        size: 0, // We don't know the size, so using 0 as default
        type: "image/jpeg", // Assuming it's a JPEG, adjust if needed
      });
    }
  }, [isEditing, expenseData]);

  // Reset form when modal is closed or opened
  useEffect(() => {
    if (openModal) {
      if (isEditing && expenseData) {
        console.log("Setting form values for editing", defaultValues);
        // Only reset with fields that are part of CreateExpenseDto
        reset({
          userId: expenseData.userId || "",
          description: expenseData.description || "",
          expenseValue: expenseData.expenseValue || 0,
          expenseDate: expenseData.expenseDate
            ? new Date(expenseData.expenseDate)
            : null,
          referenceMonth: expenseData.referenceMonth
            ? new Date(expenseData.referenceMonth)
            : null,
          expenseType: expenseData.expenseType || "",
        });
      } else {
        console.log("Resetting form for new expense");
        handleFormReset();
      }
    }
  }, [
    openModal,
    handleFormReset,
    isEditing,
    expenseData,
    defaultValues,
    reset,
  ]);

  const onSubmit = async (data: CreateExpenseDto) => {
    setIsProcessing(true);

    try {
      // Include the image data in the submission
      const expensePayload = {
        ...data,
        urlImage: fotoExpense?.base64 || "",
      };

      if (isEditing) {
        // For editing, log the data that would be sent to update endpoint
        const updateData = {
          ...expensePayload,
          _id: expenseData?._id,
          // Include any other fields needed for the update API
          publicIdImage: expenseData?.publicIdImage || "",
        };
        console.log("Editing expense with data:", updateData);
        // Make sure we have a valid ID before updating
        if (expenseData && expenseData._id) {
          await updateExpense({
            expenseId: expenseData._id,
            data: updateData as Expense,
          });
        } else {
          throw new Error("Cannot update expense: Missing expense ID");
        }
      } else {
        // For adding new expense
        await addExpense(expensePayload as CreateExpenseDto);
      }
    } catch (error) {
      console.error("Error processing operation:", error);
    } finally {
      setIsProcessing(false);
      handleFormReset();
      setOpenModal(false);
      if (onClose) onClose();
    }
  };

  return (
    <GenericModal
      title={isEditing ? "Editar Despesa" : "Inserir Despesa"}
      open={openModal}
      handleClose={() => {
        if (!isProcessing) {
          handleFormReset();
          setOpenModal(false);
          if (onClose) onClose();
        }
      }}
      cancelButtonText="Cancelar"
      confirmButtonText={
        isProcessing ? "Processando..." : isEditing ? "Salvar" : "Confirmar"
      }
      disableConfirmButton={
        isProcessing ||
        !isValid ||
        !watch("userId") ||
        !watch("expenseValue") ||
        !fotoExpense
      }
      buttonColor="success"
      handleConfirm={handleSubmit(onSubmit)}
    >
      <Box component="form" noValidate sx={{ mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          {/* Upload de Comprovante */}
          <Box sx={{ mb: 2 }}>
            <FormLabel>Comprovante da Despesa:</FormLabel>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                mt: 1,
              }}
              gap={1}
            >
              <UploadPicture
                fotoUpload={fotoExpense}
                onRemove={() => setFotoExpense(null)}
                onHover={(hover) => setHovering(hover)}
                hovering={hovering}
                avatarTitle="c"
                setFotoUpload={setFotoExpense}
                isSmall
              />
            </Box>
          </Box>
          {/* userId (Autocomplete) - alone on its row */}
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <Controller
              name="userId"
              control={control}
              rules={{ required: "Usuário é obrigatório" }}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  id="user-select"
                  options={users || []}
                  autoHighlight
                  getOptionLabel={(option) => option.name}
                  value={selectedUser}
                  onChange={(event, newValue) => {
                    setSelectedUser(newValue);
                    if (!newValue) {
                      onChange("");
                      return;
                    }
                    onChange(newValue._id!);
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
                        {isLoadingUsers ? (
                          <Loading minHeight={20} />
                        ) : (
                          <>
                            <Avatar src={option.urlImage} alt={option.name} />
                            <Text variant="subtitle1" sx={{ ml: 2 }}>
                              {option.name}
                            </Text>
                          </>
                        )}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Usuário"
                      size="small"
                      error={!!errors.userId}
                      helperText={errors.userId?.message}
                      slotProps={{
                        htmlInput: {
                          ...params.inputProps,
                          autoComplete: "new-password",
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </FormControl>

          {/* description and expenseValue sharing a row */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Descrição é obrigatória" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    fullWidth
                    size="small"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="expenseValue"
                control={control}
                rules={{
                  required: "Valor é obrigatório",
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
                    label="Valor"
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="0.00"
                    value={field.value || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                    error={!!errors.expenseValue}
                    helperText={errors.expenseValue?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* expenseDate and referenceMonth sharing a row */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="expenseDate"
                control={control}
                rules={{ required: "Data da despesa é obrigatória" }}
                render={({ field }) => (
                  <DatePicker
                    label="Data da Despesa"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.expenseDate,
                        helperText: errors.expenseDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="referenceMonth"
                control={control}
                rules={{ required: "Mês de referência é obrigatório" }}
                render={({ field }) => (
                  <DatePicker
                    label="Mês de Referência"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    views={["year", "month"]}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.referenceMonth,
                        helperText: errors.referenceMonth?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* expenseType (Select) alone on its row */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="expenseType"
              control={control}
              rules={{ required: "Tipo de despesa é obrigatório" }}
              render={({ field }) => (
                <>
                  <InputLabel id="expense-type-label">
                    Tipo de Despesa
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="expense-type-label"
                    id="expense-type-select"
                    label="Tipo de Despesa"
                    size="small"
                    error={!!errors.expenseType}
                    value={field.value || ""}
                  >
                    {expenseType.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.expenseType && (
                    <FormLabel error>{errors.expenseType.message}</FormLabel>
                  )}
                </>
              )}
            />
          </FormControl>
        </LocalizationProvider>

        {isProcessing && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} color="success" />
          </Box>
        )}
      </Box>
    </GenericModal>
  );
};
