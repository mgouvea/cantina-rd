"use client";

import React, { useState } from "react";
import TabelaComprasVisitors from "../tables/TabelaComprasVisitors";
import { Box } from "@mui/material";
import { BoxStyle } from "./BoxStyle";
import { capitalizeFirstLastName } from "@/utils";
import { DeleteModal } from "../../modal/DeleteModal";
import { GridRowModel } from "@mui/x-data-grid";
import { OrderVisitor } from "@/types";
import { useDeleteOrder } from "@/hooks/mutations";
import { useRouter } from "next/navigation";

interface ComprasVisitorsWrapperProps {
  data: OrderVisitor[];
  isLoading: boolean;
}

export const ComprasVisitorsWrapper = ({
  data,
  isLoading,
}: ComprasVisitorsWrapperProps) => {
  const router = useRouter();
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);
  const [orderNameToDelete, setOrderNameToDelete] = useState<string | null>(
    null
  );

  const handleEditClick = (row: GridRowModel) => () => {
    console.log(row);
    router.replace("/financeiro/novo");
  };

  const handleDeleteClick = (row: GridRowModel) => async () => {
    setOrderIdToDelete(row._id);
    setOrderNameToDelete(row.buyerName);
    setOpenDeleteModal(true);
  };

  const handleConfirmDeleteOrder = async () => {
    if (!orderIdToDelete) return;
    await deleteOrder(orderIdToDelete);

    setOpenDeleteModal(false);
    setOrderIdToDelete(null);
    setOrderNameToDelete(null);
  };

  return (
    <Box sx={BoxStyle}>
      <TabelaComprasVisitors
        data={data}
        isLoading={isLoading}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />

      <DeleteModal
        title="compra"
        openModal={openDeleteModal}
        nameToDelete={capitalizeFirstLastName(orderNameToDelete!)}
        setOpenModal={setOpenDeleteModal}
        onConfirmDelete={handleConfirmDeleteOrder}
      />
    </Box>
  );
};
