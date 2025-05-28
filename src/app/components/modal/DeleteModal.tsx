import React from "react";
import GenericModal from "./GenericModal";
import Text from "../ui/text/Text";

export const DeleteModal = ({
  title,
  nameToDelete,
  openModal,
  setOpenModal,
  onConfirmDelete,
}: {
  title: string;
  openModal: boolean;
  nameToDelete?: string;
  setOpenModal: (open: boolean) => void;
  onConfirmDelete: () => void;
}) => {
  const titleGender =
    title === "categoria" || title === "subcategoria" || title === "compra"
      ? "essa"
      : "esse";

  return (
    <GenericModal
      title={`Excluir ${title} ${title === "compra" ? "de" : ""} ${
        nameToDelete ? nameToDelete : ""
      }`}
      open={openModal}
      handleClose={() => {
        setOpenModal(false);
      }}
      cancelButtonText="Cancelar"
      confirmButtonText={"Confirmar"}
      buttonColor={"error"}
      handleConfirm={onConfirmDelete}
    >
      <Text variant="subtitle1" color="textSecondary">
        Tem certeza que deseja excluir {titleGender} {title}?
      </Text>
    </GenericModal>
  );
};
