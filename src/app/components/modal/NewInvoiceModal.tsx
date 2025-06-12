"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import GenericModal from "./GenericModal";
import React, { useState } from "react";
import Text from "../ui/text/Text";
import { Controller, useForm } from "react-hook-form";
import { CreateInvoiceDto } from "@/types/invoice";
import { GroupFamilyWithOwner } from "@/types";
import { useAddInvoice } from "@/hooks/mutations";
import { useGroupFamilyWithOwner } from "@/hooks/queries";
import { useSnackbar } from "@/app/components";

import {
  DateRange,
  Range as DateRangePickerRange,
  RangeKeyDict,
} from "react-date-range";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  Checkbox,
  Avatar,
  Popover,
  IconButton,
} from "@mui/material";

type NewInvoiceModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

const INITIAL_INVOICE_FORM_VALUES: CreateInvoiceDto = {
  groupFamilyIds: [],
  startDate: null,
  endDate: null,
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const OptionLabel = ({ option }: { option: GroupFamilyWithOwner }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    {option.ownerAvatar && (
      <Avatar
        src={option.ownerAvatar}
        alt={option.ownerName}
        sx={{ width: 40, height: 40 }}
      />
    )}
    <span>{option.name}</span>
  </Box>
);

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  openModal,
  setOpenModal,
}) => {
  const invoiceForm = useForm<CreateInvoiceDto>({
    defaultValues: INITIAL_INVOICE_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });
  const { showSnackbar } = useSnackbar();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFamilies, setSelectedFamilies] = useState<
    GroupFamilyWithOwner[]
  >([]);

  const [state, setState] = useState<DateRangePickerRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { mutateAsync: addInvoice } = useAddInvoice();
  const { data: groupFamiliesWithOwner } = useGroupFamilyWithOwner();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
    watch,
  } = invoiceForm;

  const onSubmit = async (data: CreateInvoiceDto) => {
    setIsProcessing(true);
    const invoicePayload = {
      groupFamilyIds:
        typeof data.groupFamilyIds === "string"
          ? [data.groupFamilyIds]
          : data.groupFamilyIds,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    try {
      await addInvoice(invoicePayload);
      showSnackbar({
        message: "Fatura gerada com sucesso!",
        severity: "success",
      });
      handleClearForm(); // Use the consolidated clear function
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding invoice:", error);
      showSnackbar({
        message: "Erro ao gerar fatura.",
        severity: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Date picker popover state
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  // Get formatted date range for display
  const getDateRangeText = () => {
    const startDate = state[0]?.startDate;
    const endDate = state[0]?.endDate;

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return "Selecione um período";
  };

  const handleCalendarOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection as DateRangePickerRange;
    setState([selection]);
    if (selection.startDate) {
      invoiceForm.setValue("startDate", selection.startDate);
    }
    if (selection.endDate) {
      invoiceForm.setValue("endDate", selection.endDate);
    }
  };

  const handleDateRangeConfirm = () => {
    handleCalendarClose();
  };

  const handleClearForm = () => {
    reset(INITIAL_INVOICE_FORM_VALUES); // Use destructured reset
    setSelectedFamilies([]);
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      } as DateRangePickerRange, // Cast to ensure correct type interpretation
    ]);
  };

  return (
    <GenericModal
      title="Gerar Fatura"
      open={openModal}
      handleClose={() => {
        if (!isProcessing) {
          handleClearForm(); // Use the consolidated clear function
          setOpenModal(false);
        }
      }}
      cancelButtonText="Cancelar"
      confirmButtonText={isProcessing ? "Processando..." : "Confirmar"}
      disableConfirmButton={
        isProcessing ||
        !isValid ||
        (watch("groupFamilyIds") || []).length === 0 ||
        !watch("startDate") ||
        !watch("endDate")
      }
      buttonColor={"success"}
      handleConfirm={handleSubmit(onSubmit)}
    >
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 2 }}>
          {/* Family selection */}
          <Box
            sx={{
              width: "100%",
              px: 2,
            }}
          >
            <Text variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
              Selecione as famílias
            </Text>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  const allFamilies =
                    groupFamiliesWithOwner
                      ?.slice()
                      .sort(
                        (a: GroupFamilyWithOwner, b: GroupFamilyWithOwner) =>
                          a.name.localeCompare(b.name)
                      ) || [];
                  setSelectedFamilies(allFamilies);
                  // Atualiza o valor no formulário
                  invoiceForm.setValue(
                    "groupFamilyIds",
                    allFamilies
                      .map((item: GroupFamilyWithOwner) => item._id || "")
                      .filter((id: string) => id !== "")
                  );
                }}
              >
                Selecionar Todos
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => {
                  setSelectedFamilies([]);
                  invoiceForm.setValue("groupFamilyIds", []);
                }}
              >
                Desmarcar Todos
              </Button>
            </Box>
            <Controller
              name="groupFamilyIds"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <Autocomplete
                  {...restField}
                  multiple
                  id="checkboxes-tags-demo"
                  options={
                    groupFamiliesWithOwner
                      ?.slice()
                      .sort(
                        (a: GroupFamilyWithOwner, b: GroupFamilyWithOwner) =>
                          a.name.localeCompare(b.name)
                      ) || []
                  }
                  disableCloseOnSelect
                  getOptionLabel={(option) =>
                    (<OptionLabel option={option} />) as unknown as string
                  }
                  value={selectedFamilies}
                  onChange={(_, newValue) => {
                    setSelectedFamilies(newValue);
                    onChange(
                      newValue
                        .map((item: GroupFamilyWithOwner) => item._id || "")
                        .filter((id: string) => id !== "")
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderOption={(props, option, { selected }) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { key, ...optionProps } = props;
                    return (
                      <li key={option._id} {...optionProps}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />

                        <OptionLabel option={option} />
                      </li>
                    );
                  }}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Famílias"
                      placeholder="Famílias"
                    />
                  )}
                />
              )}
            />
          </Box>

          {/* Date selection */}
          <Box
            sx={{
              width: "100%",
              px: 2,
            }}
          >
            <Text variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
              Selecione o período
            </Text>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <TextField
                fullWidth
                value={getDateRangeText()}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={handleCalendarOpen} edge="end">
                      <CalendarTodayIcon />
                    </IconButton>
                  ),
                }}
                label="Período"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCalendarClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box sx={{ p: 1 }}>
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleDateRangeSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                    rangeColors={["#3f51b5", "#2196f3", "#00bcd4"]}
                    maxDate={new Date()} // Limita a seleção até o dia atual
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleDateRangeConfirm}
                      sx={{ borderRadius: "8px" }}
                    >
                      OK
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </Box>
          </Box>
        </Box>
      </Box>
    </GenericModal>
  );
};
