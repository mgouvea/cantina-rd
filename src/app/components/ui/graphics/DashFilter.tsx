"use client";

import { Box } from "@mui/material";
import { SelectData } from "../../filtros/SelectData";
import { useState } from "react";
import { Range as DateRangePickerRange, RangeKeyDict } from "react-date-range";
import { useForm } from "react-hook-form";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";

type DashFilterFormDTO = {
  startDate: Date | null;
  endDate: Date | null;
};

// Função para obter o primeiro dia do mês atual
const getFirstDayOfCurrentMonth = (): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

const INITIAL_DASH_FILTER_FORM_VALUES: DashFilterFormDTO = {
  startDate: getFirstDayOfCurrentMonth(),
  endDate: new Date(),
};

export function DashFilter({
  onFilter,
}: {
  onFilter: (data: DashFilterFormDTO) => void;
}) {
  const invoiceForm = useForm<DashFilterFormDTO>({
    defaultValues: INITIAL_DASH_FILTER_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const [state, setState] = useState<DateRangePickerRange[]>([
    {
      startDate: getFirstDayOfCurrentMonth(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

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
    onFilter(invoiceForm.getValues());
  };

  const handleClearForm = () => {
    invoiceForm.reset(INITIAL_DASH_FILTER_FORM_VALUES);
    setState([
      {
        startDate: getFirstDayOfCurrentMonth(),
        endDate: new Date(),
        key: "selection",
      } as DateRangePickerRange,
    ]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "0.7rem",
        borderRadius: "8px",
        width: "350px",
      }}
    >
      <FilterAltOutlinedIcon color="disabled" />
      <SelectData
        getDateRangeText={getDateRangeText}
        handleCalendarOpen={handleCalendarOpen}
        handleCalendarClose={handleCalendarClose}
        handleDateRangeSelect={handleDateRangeSelect}
        handleDateRangeConfirm={handleDateRangeConfirm}
        open={open}
        anchorEl={anchorEl}
        state={state}
        isDashboard
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "error.main",
          cursor: "pointer",
        }}
        onClick={handleClearForm}
      >
        <CleaningServicesOutlinedIcon sx={{ fontSize: 22 }} />
      </Box>
    </Box>
  );
}
