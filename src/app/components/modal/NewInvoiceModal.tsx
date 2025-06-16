"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GenericModal from "./GenericModal";
import React, { useState } from "react";
import SelectFamilies from "../autoComplete/SelectFamilies";
import Text from "../ui/text/Text";
import { Box, Button, IconButton, Popover, TextField } from "@mui/material";
import { CreateInvoiceDto } from "@/types/invoice";
import { GroupFamilyWithOwner } from "@/types";
import { useAddInvoice } from "@/hooks/mutations";
import { useForm } from "react-hook-form";

import {
  DateRange,
  Range as DateRangePickerRange,
  RangeKeyDict,
} from "react-date-range";

type NewInvoiceModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

const INITIAL_INVOICE_FORM_VALUES: CreateInvoiceDto = {
  groupFamilyIds: [],
  startDate: null,
  endDate: null,
};

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  openModal,
  setOpenModal,
}) => {
  const invoiceForm = useForm<CreateInvoiceDto>({
    defaultValues: INITIAL_INVOICE_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const [state, setState] = useState<DateRangePickerRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { mutateAsync: addInvoice } = useAddInvoice();

  const [selectedFamilies, setSelectedFamilies] = useState<
    GroupFamilyWithOwner[]
  >([]);

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
    await addInvoice(invoicePayload).then(() => {
      setIsProcessing(false);
    });
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

  const handleSelectFamilies = (families: GroupFamilyWithOwner[]) => {
    setSelectedFamilies(families);
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
          <SelectFamilies
            invoiceForm={invoiceForm}
            control={control}
            selectedFamilies={selectedFamilies}
            onSelectFamilies={handleSelectFamilies}
            hasPadding
          />

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
