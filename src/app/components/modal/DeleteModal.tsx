"use client";
import React, { useState } from "react";
import GenericModal from "./GenericModal";
import Text from "../ui/text/Text";
import { CircularProgress, Box } from "@mui/material";

// Lista de palavras femininas em português para determinar o gênero
const FEMININE_WORDS = [
  "categoria",
  "subcategoria",
  "compra",
  "fatura",
  "venda",
  "nota",
  "família",
  "pessoa",
];

// Lista de itens que requerem confirmação adicional
const CRITICAL_ITEMS = ["fatura", "compra", "venda"];

type DeleteModalProps = {
  title: string;
  openModal: boolean;
  nameToDelete?: string;
  setOpenModal: (open: boolean) => void;
  onConfirmDelete: () => void;
  isCriticalItem?: boolean;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  nameToDelete,
  openModal,
  setOpenModal,
  onConfirmDelete,
  isCriticalItem,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const titleGender = FEMININE_WORDS.includes(title.toLowerCase())
    ? "essa"
    : "esse";

  const isCritical =
    isCriticalItem || CRITICAL_ITEMS.includes(title.toLowerCase());

  const needsPreposition =
    title === "compra" || title === "fatura" || title === "venda";

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      onConfirmDelete();
    } finally {
      setIsDeleting(false);
      setOpenModal(false);
    }
  };

  return (
    <GenericModal
      title={`Excluir ${title}${needsPreposition ? " de" : ""}${
        nameToDelete ? ` ${nameToDelete}` : ""
      }`}
      open={openModal}
      handleClose={() => {
        if (!isDeleting) {
          setOpenModal(false);
        }
      }}
      cancelButtonText="Cancelar"
      confirmButtonText={isDeleting ? "Excluindo..." : "Confirmar"}
      buttonColor={"error"}
      handleConfirm={handleConfirmDelete}
    >
      <Box sx={{ mb: isCritical ? 2 : 0 }}>
        <Text variant="subtitle1" color="textSecondary">
          Tem certeza que deseja excluir {titleGender} {title}?
        </Text>

        {isCritical && (
          <Text variant="body2" color="error" sx={{ mt: 2, fontWeight: 500 }}>
            Atenção: Esta ação não pode ser desfeita e pode afetar outros
            registros relacionados.
          </Text>
        )}

        {isDeleting && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} color="error" />
          </Box>
        )}
      </Box>
    </GenericModal>
  );
};
