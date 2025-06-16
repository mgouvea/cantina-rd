"use client";

import React, { useCallback, useEffect, useState } from "react";
import TabelaFaturas from "../tables/TabelaFaturas";
import { GroupFamily, User } from "@/types";
import { useFullInvoices } from "@/hooks/mutations";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Box } from "@mui/material";

import { NewInvoiceModal } from "../../modal/NewInvoiceModal";
import { useGroupFamilyWithOwner } from "@/hooks/queries";
import { useGroupFamilyStore } from "@/contexts";

export const FormFaturas = ({
  groupFamilies,
  dataUser,
  allInvoicesIds,
}: {
  groupFamilies: GroupFamily[];
  dataUser: User[] | null;
  allInvoicesIds: string[] | null;
}) => {
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
      <TabelaFaturas
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
