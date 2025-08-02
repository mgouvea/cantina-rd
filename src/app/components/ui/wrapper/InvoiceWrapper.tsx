"use client";

import InvoiceTable from "../tables/InvoiceTable";
import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { BoxStyle } from "./style/BoxStyle";
import { GroupFamily, User } from "@/types";
import { NewInvoiceModal } from "../../modal/NewInvoiceModal";
import { useFullInvoices } from "@/hooks/mutations";
import { useGroupFamilyStore } from "@/contexts";
import { useGroupFamilyWithOwner } from "@/hooks/queries";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface InvoiceWrapperProps {
  groupFamilies: GroupFamily[];
  dataUser: User[] | null;
  allInvoicesIds: string[] | null;
}

export const InvoiceWrapper = ({
  groupFamilies,
  dataUser,
  allInvoicesIds,
}: InvoiceWrapperProps) => {
  const { data: groupFamiliesWithOwner } = useGroupFamilyWithOwner();
  const { mutateAsync: fullInvoices, isPending: isLoadingFullInvoices } =
    useFullInvoices();

  const { updateGroupFamiliesWithOwner } = useGroupFamilyStore();

  const [fullInvoicesData, setFullInvoicesData] = useState([]);
  // false = show active invoices (open/partially paid), true = show archived invoices (fully paid)
  const [viewInvoiceArchive, setViewInvoiceArchive] = useState(false);
  const [resetFullInvoices, setResetFullInvoices] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const handleFullInvoices = useCallback(async () => {
    try {
      if (!allInvoicesIds) return;
      const data = await fullInvoices({
        ids: allInvoicesIds,
        isArchivedInvoice: viewInvoiceArchive ? "true" : "false",
      });
      setFullInvoicesData(data);
    } catch (error) {
      console.error(error);
    }
  }, [allInvoicesIds, fullInvoices, viewInvoiceArchive]);

  // Toggle between viewing active invoices (false) and archived/paid invoices (true)
  const handleViewInvoiceArchive = () => {
    setViewInvoiceArchive((prev) => !prev);
    // No need to call handleFullInvoices explicitly as the useEffect will trigger
    // when viewInvoiceArchive changes
  };

  useEffect(() => {
    if (!!groupFamiliesWithOwner) {
      updateGroupFamiliesWithOwner(groupFamiliesWithOwner);
    }
  }, [groupFamiliesWithOwner, updateGroupFamiliesWithOwner]);

  useEffect(() => {
    if (!allInvoicesIds) return;
    handleFullInvoices();
  }, [
    allInvoicesIds,
    handleFullInvoices,
    resetFullInvoices,
    viewInvoiceArchive,
  ]);

  const handleResetData = () => {
    setResetFullInvoices((prev) => !prev);
  };

  return (
    <Box sx={BoxStyle}>
      <InvoiceTable
        data={fullInvoicesData}
        groupFamilies={groupFamilies}
        dataUser={dataUser}
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
      />
    </Box>
  );
};
