"use client";

import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/components/snackbar/SnackbarProvider";
import { GroupFamily, TransferMember } from "@/types";
import { GroupFamilyForm } from "@/app/components";
import { useGroupFamilyStore } from "@/contexts/store/groupFamily.store";
import { useUserStore } from "@/contexts/store/users.store";
import { findUserById, capitalize } from "@/utils";
import { useUpdateGroupFamily } from "@/hooks/mutations";

export default function EditGroupFamilyPage() {
  const { isEditing, updateIsEditing, groupFamilyToEdit } =
    useGroupFamilyStore();
  const { allUsers } = useUserStore();
  const { mutateAsync: updateGroupFamily } = useUpdateGroupFamily();

  const queryClient = useQueryClient();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<TransferMember[]>([]);

  // Memoize form default values to prevent unnecessary re-renders
  const EDITING_FORM_VALUES = useMemo(
    () => ({
      name: groupFamilyToEdit?.name || "",
      owner: groupFamilyToEdit?.owner || "",
    }),
    [groupFamilyToEdit]
  );

  const groupFamilyForm = useForm<GroupFamily>({
    defaultValues: EDITING_FORM_VALUES,
    mode: "onChange",
  });
  const { control, watch } = groupFamilyForm;
  const { showSnackbar } = useSnackbar();

  const ownerValue = watch("owner");
  const nameValue = watch("name");

  // Memoize owner name to prevent recalculation on every render
  const ownerName = useMemo(() => {
    if (ownerValue && allUsers) {
      const ownerUser = findUserById(ownerValue, allUsers);
      return ownerUser ? capitalize(ownerUser.name) : "";
    }
    return "";
  }, [ownerValue, allUsers]);

  // Initialize selectedMembers with the current group members
  useEffect(() => {
    if (groupFamilyToEdit?.members && allUsers) {
      // Add name to each member by looking it up from allUsers
      const membersWithNames = groupFamilyToEdit.members.map((member) => {
        const user = findUserById(member.userId, allUsers);
        return {
          userId: member.userId,
          name: user ? user.name : member.userId,
        };
      });
      setSelectedMembers(membersWithNames);
    }
  }, [groupFamilyToEdit, allUsers]);

  const handleClearForm = useCallback(() => {
    router.replace("/grupo-familiar");
  }, [router]);

  const handleEditGroupFamily = useCallback(async () => {
    // Check if form is valid before submission
    if (!nameValue || !ownerValue) {
      showSnackbar({
        message: "Por favor, preencha todos os campos obrigatórios",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payloadToEdit = groupFamilyForm.getValues();
      await updateGroupFamily({
        groupFamily: payloadToEdit,
        id: groupFamilyToEdit?._id as string,
      });
      updateIsEditing(false);
      showSnackbar({
        message: `Grupo familiar editado com sucesso!`,
        severity: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["groupFamily"] });
      router.replace("/grupo-familiar");
    } catch (error) {
      showSnackbar({
        message: `Ocorreu um erro ao editar o grupo familiar! `,
        severity: "error",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    queryClient,
    router,
    groupFamilyForm,
    groupFamilyToEdit,
    showSnackbar,
    updateIsEditing,
    updateGroupFamily,
    nameValue,
    ownerValue,
  ]);

  return (
    <GroupFamilyForm
      control={control}
      selectedMembers={selectedMembers}
      allUsers={allUsers!}
      ownerName={ownerName}
      handleClearForm={handleClearForm}
      handleEditGroupFamily={handleEditGroupFamily}
      isSubmitting={isSubmitting}
      isEditing={isEditing}
    />
  );
}
