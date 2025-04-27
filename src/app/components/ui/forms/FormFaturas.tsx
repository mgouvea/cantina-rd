"use client";

import { Box, Stack } from "@mui/material";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Text from "../text/Text";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import { FormActions } from "./FormActions";
import { useForm } from "react-hook-form";
import { CustomizedAccordions } from "../../accordion/Accordion";
import { CreateInvoiceDto } from "@/types/invoice";
import TabelaFaturas from "../tables/TabelaFaturas";
import { GroupFamily, User } from "@/types";
import { useFullInvoices } from "@/hooks/mutations";

const INITIAL_INVOICE_FORM_VALUES: CreateInvoiceDto = {
  groupFamilyId: "",
  startDate: null,
  endDate: null,
};

export const FormFaturas = ({
  groupFamilies,
  dataUser,
  allInvoicesIds,
}: {
  groupFamilies: GroupFamily[];
  dataUser: User[] | null;
  allInvoicesIds: string[] | null;
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
  }, [allInvoicesIds, handleFullInvoices]);

  const handleSaveInvoice = async () => {
    setIsSubmitting(true);
    try {
      console.log("FATURA");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    invoiceForm.reset(INITIAL_INVOICE_FORM_VALUES);
  };

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
          <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ my: 2 }}>
            <EntradaTexto
              name="groupFamilyId"
              control={control}
              label="Família"
            />
            <EntradaTexto
              name="startDate"
              control={control}
              label="Data de início"
            />
            <EntradaTexto
              name="endDate"
              control={control}
              label="Data de fim"
            />

            <FormActions
              onClear={handleClearForm}
              onSave={handleSaveInvoice}
              disabled={!isFormValid}
              isSubmitting={isSubmitting}
              isFatura
            />
          </Stack>
        </CustomizedAccordions>
      </Box>

      <TabelaFaturas
        data={fullInvoicesData}
        groupFamilies={groupFamilies}
        dataUser={dataUser}
        isLoading={isLoadingFullInvoices}
        onDeleteInvoice={() => console.log("Deletar fatura")}
      />
    </Box>
  );
};
