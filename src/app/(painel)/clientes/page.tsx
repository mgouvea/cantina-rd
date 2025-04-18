"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Loading from "@/app/components/loading/Loading";
import TabelaCliente from "@/app/components/ui/tables/TabelaCliente";
import { Client, User } from "@/types";
import { useApp } from "@/contexts";
import { useEffect, useState } from "react";
import { useGroupFamily, useUsers } from "@/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/components";
import { useUserStore } from "@/contexts/store/users.store";

import {
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowModesModel,
} from "@mui/x-data-grid";
import {
  useAddAdmin,
  useDeleteAdmin,
  useDeleteUser,
  useRemoveMemberFromGroupFamily,
  useUpdateUser,
} from "@/hooks/mutations";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Clientes" },
];

export default function Clientes() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading } = useUsers();
  const { setUserContext } = useApp();

  useEffect(() => {
    if (!isLoading && data) {
      setUserContext(data);
    }
  }, [data, isLoading, setUserContext]);

  const [rows, setRows] = useState<Client[]>(data);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [openModal, setOpenModal] = useState(false);
  const [enableOrDisableAdmin, setEnableOrDisableAdmin] = useState(false);
  const [userClicked, setUserClicked] = useState<User | null>(null);
  const [email, setEmail] = useState("");

  const { data: groupFamilies } = useGroupFamily();

  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: addAdmin } = useAddAdmin();
  const { mutateAsync: deleteAdmin } = useDeleteAdmin();
  const { mutateAsync: removeMemberFromGroupFamily } =
    useRemoveMemberFromGroupFamily();

  const { updateUserToEdit, updateIsEditing } = useUserStore();
  const { showSnackbar } = useSnackbar();

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row: GridRowModel) => () => {
    updateUserToEdit(row as User);
    updateIsEditing(true);
    router.replace("/clientes/novo");
  };

  const handleDeleteClick = (userId: string) => async () => {
    try {
      await deleteUser(userId);
      await removeMemberFromGroupFamily([userId]);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSnackbar({
        message: "Cliente deletado com sucesso!",
        severity: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      showSnackbar({
        message: "Erro ao deletar o cliente",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      rows.map((row: Client) =>
        row._id === newRow._id ? updatedRow : row
      ) as Client[]
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleOpenModal = (row: User) => {
    if (row.isAdmin) {
      setEnableOrDisableAdmin(false);
    } else {
      setEnableOrDisableAdmin(true);
    }
    setOpenModal(true);
    setUserClicked(row);
  };

  const handleEnableOrDisableAdmin = async () => {
    const payloadAdmin = {
      idUser: userClicked?._id ?? "",
      name: userClicked?.name ?? "",
      email: email,
      password: "udv@realeza",
      createdAt: new Date(),
    };

    try {
      if (enableOrDisableAdmin) {
        await addAdmin(payloadAdmin);
        await updateUser({
          user: { isAdmin: true },
          userId: userClicked?._id ?? "",
        });
      } else {
        await deleteAdmin(userClicked?._id ?? "");
        await updateUser({
          user: { isAdmin: false },
          userId: userClicked?._id ?? "",
        });
      }

      setEmail("");
      setOpenModal(false);
      showSnackbar({
        message:
          "Administrador " +
          (enableOrDisableAdmin ? "habilitado" : "desabilitado") +
          " com sucesso!",
        severity: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      showSnackbar({
        message:
          "Erro ao " +
          (enableOrDisableAdmin ? "habilitar" : "desabilitar") +
          " o administrador",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return (
      <TabelaCliente
        data={data}
        isLoading={isLoading}
        groupFamilies={groupFamilies}
        enableOrDisableAdmin={enableOrDisableAdmin}
        openModal={openModal}
        userClicked={userClicked}
        email={email}
        rowModesModel={rowModesModel}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleRowEditStop={handleRowEditStop}
        handleRowModesModelChange={handleRowModesModelChange}
        handleOpenModal={handleOpenModal}
        handleEnableOrDisableAdmin={handleEnableOrDisableAdmin}
        setEmail={setEmail}
        updateIsEditing={updateIsEditing}
        updateUserToEdit={updateUserToEdit}
        setRowModesModel={setRowModesModel}
        processRowUpdate={processRowUpdate}
        setRows={setRows}
        setOpenModal={setOpenModal}
      />
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
