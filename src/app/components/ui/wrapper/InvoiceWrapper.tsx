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
  const [resetFullInvoices, setResetFullInvoices] = useState(false);

  const [openModal, setOpenModal] = useState(false);

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
    if (!!groupFamiliesWithOwner) {
      updateGroupFamiliesWithOwner(groupFamiliesWithOwner);
    }
  }, [groupFamiliesWithOwner, updateGroupFamiliesWithOwner]);

  useEffect(() => {
    if (!allInvoicesIds) return;
    handleFullInvoices();
  }, [allInvoicesIds, handleFullInvoices, resetFullInvoices]);

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
      />

      <NewInvoiceModal openModal={openModal} setOpenModal={setOpenModal} />
    </Box>
  );
};
