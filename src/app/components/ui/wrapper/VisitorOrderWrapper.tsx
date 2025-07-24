"use client";

import React, { useState } from "react";
import VisitorOrderTable from "../tables/VisitorOrderTable";
import { Box } from "@mui/material";
import { BoxStyle } from "./style/BoxStyle";
import { capitalizeFirstLastName } from "@/utils";
import { DeleteModal } from "../../modal/DeleteModal";
import { GridRowModel } from "@mui/x-data-grid";
import { OrderVisitor } from "@/types";
import { useDeleteOrderVisitor } from "@/hooks/mutations";
import { useRouter } from "next/navigation";

interface VisitorOrderWrapperProps {
  data: OrderVisitor[];
  isLoading: boolean;
}

export const VisitorOrderWrapper = ({
  data,
  isLoading,
}: VisitorOrderWrapperProps) => {
  const router = useRouter();
  const { mutateAsync: deleteOrderVisitor } = useDeleteOrderVisitor();

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
    await deleteOrderVisitor(orderIdToDelete);

    setOpenDeleteModal(false);
    setOrderIdToDelete(null);
    setOrderNameToDelete(null);
  };

  return (
    <Box sx={BoxStyle}>
      <VisitorOrderTable
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
