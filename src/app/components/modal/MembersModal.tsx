"use client";

import GenericModal from "./GenericModal";
import ListMembers from "../ui/listMembers/ListMembers";
import { SelectedMember, User } from "@/types";
import { Stack } from "@mui/material";
import { useState } from "react";
import { useUsers } from "@/hooks/queries";

import {
  useAddMemberToGroupFamily,
  useRemoveMemberFromGroupFamily,
} from "@/hooks/mutations";

interface MembersModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  addOrRemove: "add" | "remove";
  idGroupFamily: string;
  members: SelectedMember[];
  setMembers: (members: SelectedMember[]) => void;
  selectedUserIds: string[];
  setSelectedUserIds: (ids: string[]) => void;
  setIdGroupFamily: (id: string | null) => void;
}

export const MemberModal = ({
  openModal,
  setOpenModal,
  addOrRemove,
  idGroupFamily,
  members,
  setMembers,
  selectedUserIds,
  setSelectedUserIds,
  setIdGroupFamily,
}: MembersModalProps) => {
  const { data: allUsers } = useUsers(openModal);
  const { mutateAsync: addMemberToGroupFamily } = useAddMemberToGroupFamily();
  const { mutateAsync: removeMemberFromGroupFamily } =
    useRemoveMemberFromGroupFamily();

  const [clickedUsersFromListMembers, setClickedUsersFromListMembers] =
    useState<User[]>([]);

  const handleAddOrRemoveMember = async () => {
    const updateUserPayload = clickedUsersFromListMembers.map(
      (item) => item._id!
    );

    const removeGroupFamilyFromUsers = clickedUsersFromListMembers.map(
      (item) => item._id!
    );

    if (addOrRemove === "add") {
      await addMemberToGroupFamily({
        groupFamilyId: idGroupFamily,
        membersIds: updateUserPayload,
      });
    } else {
      await removeMemberFromGroupFamily({
        groupFamilyId: idGroupFamily,
        membersIds: removeGroupFamilyFromUsers,
      });
    }

    setOpenModal(false);
    setSelectedUserIds([]);
    setMembers([]);
    setIdGroupFamily(null);
    setClickedUsersFromListMembers([]);
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
