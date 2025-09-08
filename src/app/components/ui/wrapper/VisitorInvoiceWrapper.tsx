"use client";

import { useCallback, useEffect, useState } from "react";
import VisitorInvoiceTable from "../tables/VisitorInvoiceTable";
import { Box } from "@mui/material";
import { BoxStyle } from "./style/BoxStyle";
import { NewInvoiceModal } from "../../modal/NewInvoiceModal";
import { useFullInvoicesVisitors } from "@/hooks/mutations";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface VisitorInvoiceWrapperProps {
  allVisitorsIds: string[] | null;
  viewType: "socios" | "visitantes";
}

export const VisitorInvoiceWrapper = ({ allVisitorsIds, viewType }: VisitorInvoiceWrapperProps) => {
  const { mutateAsync: fullInvoices, isPending: isLoadingFullInvoices } = useFullInvoicesVisitors();

  const [fullInvoicesData, setFullInvoicesData] = useState([]);
  const [viewInvoiceArchive, setViewInvoiceArchive] = useState(false);
  const [resetFullInvoices, setResetFullInvoices] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const handleFullInvoices = useCallback(async () => {
    try {
      if (!allVisitorsIds) return;
      const data = await fullInvoices({
        ids: allVisitorsIds,
        isArchivedInvoice: viewInvoiceArchive ? "true" : "false",
      });
      setFullInvoicesData(data);
    } catch (error) {
      console.error(error);
    }
  }, [allVisitorsIds, fullInvoices, viewInvoiceArchive]);

  useEffect(() => {
    if (!allVisitorsIds) return;
    handleFullInvoices();
  }, [allVisitorsIds, handleFullInvoices, resetFullInvoices, viewInvoiceArchive]);

  const handleResetData = () => {
    setResetFullInvoices((prev) => !prev);
  };

  const handleViewInvoiceArchive = () => {
    setViewInvoiceArchive((prev) => !prev);
  };

  return (
    <Box sx={BoxStyle}>
      <VisitorInvoiceTable
        data={fullInvoicesData}
        isLoading={isLoadingFullInvoices}
        onResetData={handleResetData}
        setOpenModal={setOpenModal}
        viewInvoiceArchive={viewInvoiceArchive}
        onViewInvoiceArchive={handleViewInvoiceArchive}
      />

      <NewInvoiceModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleResetData={handleResetData}
        viewType={viewType}
      />
    </Box>
  );
};
