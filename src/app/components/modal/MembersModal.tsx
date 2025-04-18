"use client";

import GenericModal from "./GenericModal";
import ListMembers from "../ui/listMembers/ListMembers";
import { SelectedMember, User } from "@/types";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../snackbar/SnackbarProvider";
import { useState } from "react";
import {
  useUpdateMembersGroupFamily,
  useUpdateUsersGroupFamily,
} from "@/hooks/mutations";

export const MemberModal = ({
  allUsers,
  openModal,
  setOpenModal,
  addOrRemove,
  idGroupFamily,
  members,
  setMembers,
  selectedUserIds,
  setSelectedUserIds,
  setIdGroupFamily,
}: {
  allUsers: User[] | null;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  addOrRemove: "add" | "remove";
  idGroupFamily: string;
  members: SelectedMember[];
  setMembers: (members: SelectedMember[]) => void;
  selectedUserIds: string[];
  setSelectedUserIds: (ids: string[]) => void;
  setIdGroupFamily: (id: string | null) => void;
}) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { mutateAsync: updateMembersGroupFamily } =
    useUpdateMembersGroupFamily();
  const { mutateAsync: updateUser } = useUpdateUsersGroupFamily();

  const [clickedUsersFromListMembers, setClickedUsersFromListMembers] =
    useState<User[]>([]);

  const handleAddOrRemoveMember = async () => {
    const updateUserPayload = clickedUsersFromListMembers.map((item) => ({
      userId: item._id!,
      name: item.name,
    }));

    try {
      await updateMembersGroupFamily({
        id: idGroupFamily,
        members: members,
      });

      await updateUser({
        groupFamilyId: idGroupFamily,
        users: updateUserPayload,
      });

      // Após a operação bem-sucedida
      queryClient.invalidateQueries({ queryKey: ["groupFamily"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar({
        message: `Membros ${
          addOrRemove === "add" ? "adicionados" : "removidos"
        } com sucesso!`,
        severity: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      showSnackbar({
        message: `Erro ao ${
          addOrRemove === "add" ? "adicionar" : "remover"
        } membros`,
        severity: "error",
        duration: 3000,
      });
    } finally {
      setOpenModal(false);
      setSelectedUserIds([]);
      setMembers([]);
      setIdGroupFamily(null);
      setClickedUsersFromListMembers([]);
    }
  };

  return (
    <GenericModal
      title={addOrRemove === "add" ? "Adicionar membro" : "Remover membro"}
      open={openModal}
      handleClose={() => {
        setOpenModal(false);
      }}
      cancelButtonText="Cancelar"
      confirmButtonText={addOrRemove === "add" ? "Adicionar" : "Remover"}
      buttonColor={addOrRemove === "add" ? "success" : "error"}
      handleConfirm={handleAddOrRemoveMember}
    >
      <Stack sx={{ flexDirection: "column", gap: 3, width: "100%" }}>
        {allUsers && (
          <ListMembers
            members={members}
            setMembers={setMembers}
            addOrRemove={addOrRemove}
            users={allUsers}
            groupMembers={members}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
            clickedUsersFromListMembers={clickedUsersFromListMembers}
            setClickedUsersFromListMembers={setClickedUsersFromListMembers}
          />
        )}
      </Stack>
    </GenericModal>
  );
};
