"use client";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import TabelaFaturas from "../tables/TabelaFaturas";
import Text from "../text/Text";
import { Controller, useForm } from "react-hook-form";
import { CreateInvoiceDto } from "@/types/invoice";
import { CustomizedAccordions } from "../../accordion/Accordion";
import { FormActions } from "./FormActions";
import { GroupFamily, GroupFamilyWithOwner, User } from "@/types";
import { useFullInvoices } from "@/hooks/mutations";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange, Range, RangeKeyDict } from "react-date-range";

import {
  Box,
  Avatar,
  Autocomplete,
  Checkbox,
  TextField,
  Button,
  Popover,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const INITIAL_INVOICE_FORM_VALUES: CreateInvoiceDto = {
  groupFamilyId: "",
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

export const FormFaturas = ({
  groupFamilies,
  dataUser,
  allInvoicesIds,
  groupFamiliesWithOwner,
}: {
  groupFamilies: GroupFamily[];
  dataUser: User[] | null;
  allInvoicesIds: string[] | null;
  groupFamiliesWithOwner: GroupFamilyWithOwner[] | null;
}) => {
  const invoiceForm = useForm<CreateInvoiceDto>({
    defaultValues: INITIAL_INVOICE_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const { mutateAsync: fullInvoices, isPending: isLoadingFullInvoices } =
    useFullInvoices();
  const { control } = invoiceForm;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullInvoicesData, setFullInvoicesData] = useState([]);
  const [resetFullInvoices, setResetFullInvoices] = useState(false);
  const [selectedFamilies, setSelectedFamilies] = useState<
    GroupFamilyWithOwner[]
  >([]);

  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
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
    const selection = rangesByKey.selection;
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

  const handleFullInvoices = useCallback(async () => {
    try {
      if (!allInvoicesIds) return;
      const data = await fullInvoices(allInvoicesIds);
      setFullInvoicesData(data);
    } catch (error) {
      console.error(error);
    }
  }, [allInvoicesIds, fullInvoices]);

  useEffect(() => {
    if (!allInvoicesIds) return;
    handleFullInvoices();
  }, [allInvoicesIds, handleFullInvoices, resetFullInvoices]);

  const handleSaveInvoice = async () => {
    setIsSubmitting(true);
    try {
      console.log("FATURA", invoiceForm.getValues());
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetData = () => {
    setResetFullInvoices((prev) => !prev);
  };

  const handleClearForm = () => {
    invoiceForm.reset(INITIAL_INVOICE_FORM_VALUES);
    setSelectedFamilies([]);
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  useEffect(() => {
    if (invoiceForm.formState.isSubmitSuccessful) {
      setSelectedFamilies([]);
    }
  }, [invoiceForm.formState.isSubmitSuccessful]);

  const isFormValid = useMemo(() => {
    return invoiceForm.formState.isValid && invoiceForm.formState.isDirty;
  }, [invoiceForm.formState]);

  return (
    <Box
      sx={{
        padding: 2,
        height: "fit-content",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <Text variant="h5">Gerar Faturas</Text>
      <Box sx={{ my: 2 }}>
        <CustomizedAccordions title="Gerar nova fatura" open={true}>
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
              <Controller
                name="groupFamilyId"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <Autocomplete
                    {...restField}
                    multiple
                    id="checkboxes-tags-demo"
                    options={
                      groupFamiliesWithOwner
                        ?.slice()
                        .sort((a, b) => a.name.localeCompare(b.name)) || []
                    }
                    disableCloseOnSelect
                    getOptionLabel={(option) =>
                      (<OptionLabel option={option} />) as unknown as string
                    }
                    value={selectedFamilies}
                    onChange={(_, newValue) => {
                      setSelectedFamilies(newValue);
                      const selectedIds = newValue
                        .map((item) => item._id)
                        .join(",");
                      onChange(selectedIds);
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
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
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

                <FormActions
                  onClear={handleClearForm}
                  onSave={handleSaveInvoice}
                  disabled={!isFormValid}
                  isSubmitting={isSubmitting}
                  isFatura
                />
              </Box>
            </Box>
          </Box>
        </CustomizedAccordions>
      </Box>

      <TabelaFaturas
        data={fullInvoicesData}
        groupFamilies={groupFamilies}
        dataUser={dataUser}
        isLoading={isLoadingFullInvoices}
        onDeleteInvoice={() => console.log("Deletar fatura")}
        onResetData={handleResetData}
      />
    </Box>
  );
};
