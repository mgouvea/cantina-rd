"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Loading from "@/app/components/loading/Loading";
import TabelaGrupoFamiliar from "@/app/components/ui/tables/TabelaGrupoFamiliar";
import { useApp } from "@/contexts";
import { useDeleteGroupFamily } from "@/hooks/mutations";
import { useEffect, useState } from "react";
import { useGroupFamily } from "@/hooks/queries/useGroupFamily.query";
import { useGroupFamilyStore } from "@/contexts/store/groupFamily.store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DeleteModal, MemberModal, useSnackbar } from "@/app/components";
import { useUsers } from "@/hooks/queries";
import { useUserStore } from "@/contexts/store/users.store";

import type { GroupFamily, SelectedMember } from "@/types";
import {
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowModesModel,
} from "@mui/x-data-grid";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Grupo Familiar" },
];

export default function GroupFamily() {
  const { data, isLoading } = useGroupFamily();
  const { data: dataUser } = useUsers();
  const { setUserContext } = useApp();

  const { updateAllUsers, allUsers } = useUserStore();

  const queryClient = useQueryClient();
  const router = useRouter();
  const [rows, setRows] = useState<GroupFamily[]>(data);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const { showSnackbar } = useSnackbar();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [nameToDelete, setNameToDelete] = useState<string | null>(null);

  const [addOrRemove, setAddOrRemove] = useState<"add" | "remove">("add");
  const [members, setMembers] = useState<SelectedMember[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [idGroupFamily, setIdGroupFamily] = useState<string | null>(null);

  const { mutateAsync: deleteGroupFamily } = useDeleteGroupFamily();
  const { updateGroupFamilyToEdit, updateIsEditing } = useGroupFamilyStore();

  useEffect(() => {
    if (!isLoading && data) {
      setUserContext(data);
      updateAllUsers(dataUser);
    }
  }, [data, isLoading, setUserContext, dataUser, updateAllUsers]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row: GridRowModel) => () => {
    updateGroupFamilyToEdit(row as GroupFamily);
    updateIsEditing(true);
    router.replace("/grupo-familiar/edit");
  };

  const handleDeleteClick = (id: string, row: GridRowModel) => () => {
    console.log("row", row);
    setIdToDelete(id);
    setNameToDelete(row.name);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    try {
      await deleteGroupFamily(idToDelete);
      queryClient.invalidateQueries({ queryKey: ["groupFamily"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar({
        message: "Grupo Familiar deletado com sucesso!",
        severity: "success",
        duration: 3000,
      });
      setOpenDeleteModal(false);
    } catch (error) {
      showSnackbar({
        message: "Erro ao deletar grupo familiar",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const typedNewRow = newRow as unknown as GroupFamily;
    const updatedRow = { ...typedNewRow, isNew: false };
    setRows(
      rows.map((row) => (row._id === typedNewRow._id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleEditMembers =
    (row: GroupFamily, addOrRemove: "add" | "remove") => () => {
      setAddOrRemove(addOrRemove);
      setMembers(row.members);
      setSelectedUserIds([]);
      setOpenModal(true);
      setIdGroupFamily(row._id!);
    };

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return (
      <TabelaGrupoFamiliar
        data={data}
        isLoading={isLoading}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        processRowUpdate={processRowUpdate}
        handleRowModesModelChange={handleRowModesModelChange}
        handleRowEditStop={handleRowEditStop}
        rows={rows}
        rowModesModel={rowModesModel}
        handleEditMembers={handleEditMembers}
        setRows={setRows}
      />
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
      <MemberModal
        allUsers={allUsers}
        openModal={openModal}
        setOpenModal={setOpenModal}
        addOrRemove={addOrRemove}
        idGroupFamily={idGroupFamily!}
        members={members}
        setMembers={setMembers}
        selectedUserIds={selectedUserIds}
        setSelectedUserIds={setSelectedUserIds}
        setIdGroupFamily={setIdGroupFamily}
      />
      <DeleteModal
        title="grupo familiar"
        nameToDelete={nameToDelete!}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirmDelete={confirmDelete}
      />
    </ContentWrapper>
  );
}
