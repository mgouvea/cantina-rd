"use client";

import GenericModal from "./GenericModal";
import ListMembers from "../ui/listMembers/ListMembers";
import { SelectedMember, User } from "@/types";
import { Stack } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { useUsers } from "@/hooks/queries";
import { useUserStore } from "@/contexts";

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
  // Use the store for users if available to avoid unnecessary fetching
  const { allUsers: storeUsers } = useUserStore();

  // Only fetch users if the modal is open and we don't have users in the store
  const shouldFetchUsers =
    openModal && (!storeUsers || storeUsers.length === 0);
  const { data: fetchedUsers } = useUsers(shouldFetchUsers);

  // Use store users if available, otherwise use fetched users
  const allUsers = useMemo(() => {
    return storeUsers && storeUsers.length > 0
      ? storeUsers
      : fetchedUsers || [];
  }, [storeUsers, fetchedUsers]);

  // Memoize mutations to prevent unnecessary re-renders
  const { mutateAsync: addMemberToGroupFamily } = useAddMemberToGroupFamily();
  const { mutateAsync: removeMemberFromGroupFamily } =
    useRemoveMemberFromGroupFamily();

  const [clickedUsersFromListMembers, setClickedUsersFromListMembers] =
    useState<User[]>([]);

  // Memoize handler functions to prevent unnecessary re-renders
  const handleAddOrRemoveMember = useCallback(async () => {
    if (clickedUsersFromListMembers.length === 0) return;

    const memberIds = clickedUsersFromListMembers.map((item) => item._id!);

    try {
      if (addOrRemove === "add") {
        await addMemberToGroupFamily({
          groupFamilyId: idGroupFamily,
          membersIds: memberIds,
        });
      } else {
        await removeMemberFromGroupFamily({
          groupFamilyId: idGroupFamily,
          membersIds: memberIds,
        });
      }
    } finally {
      // Clean up regardless of success or failure
      setOpenModal(false);
      setSelectedUserIds([]);
      setMembers([]);
      setIdGroupFamily(null);
      setClickedUsersFromListMembers([]);
    }
  }, [
    clickedUsersFromListMembers,
    addOrRemove,
    idGroupFamily,
    addMemberToGroupFamily,
    removeMemberFromGroupFamily,
    setOpenModal,
    setSelectedUserIds,
    setMembers,
    setIdGroupFamily,
  ]);

  // Memoize modal close handler
  const handleClose = useCallback(() => {
    setOpenModal(false);
    // Clear selections when closing
    setSelectedUserIds([]);
    setClickedUsersFromListMembers([]);
  }, [setOpenModal, setSelectedUserIds]);

  // Memoize modal title and button text to prevent unnecessary calculations
  const modalTitle =
    addOrRemove === "add" ? "Adicionar membro" : "Remover membro";
  const confirmButtonText = addOrRemove === "add" ? "Adicionar" : "Remover";
  const buttonColor = addOrRemove === "add" ? "success" : "error";

  return (
    <GenericModal
      title={modalTitle}
      open={openModal}
      handleClose={handleClose}
      cancelButtonText="Cancelar"
      confirmButtonText={confirmButtonText}
      buttonColor={buttonColor}
      handleConfirm={handleAddOrRemoveMember}
    >
      <Stack sx={{ flexDirection: "column", gap: 3, width: "100%" }}>
        {allUsers && allUsers.length > 0 && (
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
