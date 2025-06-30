"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { BoxStyle } from "./BoxStyle";
import TabelaCompras from "../tables/TabelaCompras";
import { Order } from "@/types";
import { GridRowModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useDeleteOrder } from "@/hooks/mutations";
import { DeleteModal } from "../../modal/DeleteModal";
import { capitalizeFirstLastName } from "@/utils";
import { FormNewOrders } from "../forms/FormNewOrders";

interface ComprasWrapperProps {
  data: Order[];
  isLoading: boolean;
}

export const ComprasWrapper = ({ data, isLoading }: ComprasWrapperProps) => {
  const router = useRouter();
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  const [newOrder, setNewOrder] = useState<boolean>(false);

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

  const handleNewOrderClick = () => {
    setNewOrder((prev) => !prev);
  };

  return (
    <Box sx={BoxStyle}>
      {newOrder ? (
        <FormNewOrders onClickBack={handleNewOrderClick} />
      ) : (
        <TabelaCompras
          data={data}
          isLoading={isLoading}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          onClickNewOrder={handleNewOrderClick}
        />
      )}

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
