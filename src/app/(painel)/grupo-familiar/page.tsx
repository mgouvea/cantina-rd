"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import GroupFamilyTable from "@/app/components/ui/tables/GroupFamilyTable";
import Loading from "@/app/components/loading/Loading";
import { DeleteModal, MemberModal } from "@/app/components";
import { GridRowModel } from "@mui/x-data-grid";
import { useDeleteGroupFamily } from "@/hooks/mutations";
import { useEffect, useState } from "react";
import { useGroupFamily } from "@/hooks/queries/useGroupFamily.query";
import { useGroupFamilyStore } from "@/contexts/store/groupFamily.store";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/queries";
import { useUserStore } from "@/contexts";

import type { GroupFamily, SelectedMember } from "@/types";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Grupo Familiar" },
];

export default function GroupFamily() {
  const { data, isLoading } = useGroupFamily();
  const { data: dataUsers, isLoading: isLoadingUsers } = useUsers();

  const router = useRouter();
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
  const { updateAllUsers } = useUserStore();

  useEffect(() => {
    if (!isLoadingUsers) {
      updateAllUsers(dataUsers);
    }
  }, [dataUsers, isLoadingUsers, updateAllUsers]);

  const handleEditClick = (row: GridRowModel) => () => {
    updateGroupFamilyToEdit(row as GroupFamily);
    updateIsEditing(true);
    router.replace("/grupo-familiar/edit");
  };

  const handleDeleteClick = (row: GridRowModel) => () => {
    setIdToDelete(row._id);
    setNameToDelete(row.name);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    await deleteGroupFamily(idToDelete);
    setOpenDeleteModal(false);
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
      <GroupFamilyTable
        data={data}
        isLoading={isLoading}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleEditMembers={handleEditMembers}
      />
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
      <MemberModal
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
