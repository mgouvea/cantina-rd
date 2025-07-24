"use client";

import GenericModal from "./GenericModal";
import React, { useEffect, useState } from "react";
import SelectFamilies from "../autoComplete/SelectFamilies";
import SelectVisitors from "../autoComplete/SelectVisitors";
import { Box } from "@mui/material";
import {
  CreateInvoiceClientDto,
  CreateInvoiceVisitorsDto,
  GroupFamilyWithOwner,
  Visitor,
} from "@/types";
import { Range as DateRangePickerRange, RangeKeyDict } from "react-date-range";
import { SelectData } from "../filters/SelectData";
import { useAddInvoice, useAddInvoiceVisitors } from "@/hooks/mutations";
import { useForm } from "react-hook-form";
import { useVisitors } from "@/hooks/queries/useVisitors.query";

type NewInvoiceModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  viewType?: "socios" | "visitantes";
};

const INITIAL_INVOICE_FORM_VALUES_CLIENT: CreateInvoiceClientDto = {
  groupFamilyIds: [],
  startDate: null,
  endDate: null,
};

const INITIAL_INVOICE_FORM_VALUES_VISITORS: CreateInvoiceVisitorsDto = {
  visitorsIds: [],
  startDate: null,
  endDate: null,
};

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  openModal,
  setOpenModal,
  viewType = "socios", // Default to socios if not provided
}) => {
  // Get initial values based on viewType
  const getInitialValues = () => {
    return viewType === "socios"
      ? INITIAL_INVOICE_FORM_VALUES_CLIENT
      : INITIAL_INVOICE_FORM_VALUES_VISITORS;
  };

  const invoiceForm = useForm<
    CreateInvoiceClientDto | CreateInvoiceVisitorsDto
  >({
    defaultValues: getInitialValues(),
    mode: "onChange",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [state, setState] = useState<DateRangePickerRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { data: allVisitors } = useVisitors();
  const { mutateAsync: addInvoice } = useAddInvoice();
  const { mutateAsync: addInvoiceVisitors } = useAddInvoiceVisitors();

  const [selectedFamilies, setSelectedFamilies] = useState<
    GroupFamilyWithOwner[]
  >([]);
  const [selectedVisitors, setSelectedVisitors] = useState<Visitor[]>([]);

  const { control, handleSubmit, reset, setValue } = invoiceForm;

  // Sync selected families/visitors with form when they change
  useEffect(() => {
    if (viewType === "socios") {
      setValue(
        "groupFamilyIds",
        selectedFamilies.map((family) => family._id || "")
      );
    } else {
      setValue(
        "visitorsIds",
        selectedVisitors.map((visitor) => visitor._id)
      );
    }
  }, [selectedFamilies, selectedVisitors, viewType, setValue]);

  // Reset form when viewType changes
  useEffect(() => {
    handleClearForm();
  }, [viewType]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (
    data: CreateInvoiceClientDto | CreateInvoiceVisitorsDto
  ) => {
    try {
      setIsProcessing(true);

      if (viewType === "socios") {
        // Para sócios: Garantir que temos um array de IDs de famílias
        const clientData = data as CreateInvoiceClientDto;
        const invoicePayload: CreateInvoiceClientDto = {
          groupFamilyIds: Array.isArray(clientData.groupFamilyIds)
            ? clientData.groupFamilyIds
            : [clientData.groupFamilyIds].filter(Boolean),
          startDate: clientData.startDate,
          endDate: clientData.endDate,
        };
        await addInvoice(invoicePayload);
      } else {
        // Para visitantes: Garantir que temos um array de IDs de visitantes
        // Usamos o estado selectedVisitors para garantir que temos os IDs corretos
        const invoicePayload: CreateInvoiceVisitorsDto = {
          visitorsIds: selectedVisitors.map((visitor) => visitor._id),
          startDate: data.startDate,
          endDate: data.endDate,
        };
        await addInvoiceVisitors(invoicePayload);
      }

      // Limpar o formulário após sucesso
      handleClearForm();
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao gerar fatura:", error);
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

  const handleSelectFamilies = (families: GroupFamilyWithOwner[]) => {
    setSelectedFamilies(families);
  };

  const handleSelectVisitors = (visitors: Visitor[]) => {
    setSelectedVisitors(visitors);
  };

  const handleDateRangeSelect = (rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection as DateRangePickerRange;
    setState([selection]);

    // Update form values for both types
    if (selection.startDate) {
      setValue("startDate", selection.startDate);
    }
    if (selection.endDate) {
      setValue("endDate", selection.endDate);
    }
  };

  const handleDateRangeConfirm = () => {
    handleCalendarClose();
  };

  const handleClearForm = () => {
    // Reset form with appropriate initial values based on viewType
    reset(getInitialValues());
    setSelectedFamilies([]);
    setSelectedVisitors([]);
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  // Check if form is valid based on viewType
  const isFormValid = () => {
    const hasDateRange = state[0]?.startDate && state[0]?.endDate;

    if (viewType === "socios") {
      return selectedFamilies.length > 0 && hasDateRange;
    } else {
      return selectedVisitors.length > 0 && hasDateRange;
    }
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
      disableConfirmButton={isProcessing || !isFormValid()}
      buttonColor={"success"}
      handleConfirm={handleSubmit(onSubmit)}
    >
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 2 }}>
          {viewType !== "visitantes" && (
            <SelectFamilies
              invoiceForm={invoiceForm}
              control={control}
              selectedFamilies={selectedFamilies}
              onSelectFamilies={handleSelectFamilies}
              hasPadding
            />
          )}

          {viewType === "visitantes" && (
            <SelectVisitors
              invoiceForm={invoiceForm}
              control={control}
              selectedVisitors={selectedVisitors}
              onSelectVisitors={handleSelectVisitors}
              allVisitors={allVisitors}
              hasPadding
            />
          )}

          {/* Date selection */}
          <SelectData
            getDateRangeText={getDateRangeText}
            handleCalendarOpen={handleCalendarOpen}
            handleCalendarClose={handleCalendarClose}
            handleDateRangeSelect={handleDateRangeSelect}
            handleDateRangeConfirm={handleDateRangeConfirm}
            open={open}
            anchorEl={anchorEl}
            state={state}
          />
        </Box>
      </Box>
    </GenericModal>
  );
};
