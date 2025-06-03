"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import EmojiPeopleOutlinedIcon from "@mui/icons-material/EmojiPeopleOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Loading from "@/app/components/loading/Loading";
import TabelaCliente from "@/app/components/ui/tables/TabelaCliente";
import TabelaVisitantes from "@/app/components/ui/tables/TabelaVisitantes";
import { a11yProps, capitalizeFirstLastName } from "@/utils";
import { Box, Stack, Tab, Tabs, useTheme } from "@mui/material";
import { User } from "@/types";
import { CustomTabPanel, DeleteModal, useSnackbar } from "@/app/components";
import { Suspense, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsers } from "@/hooks/queries";
import { useUserStore } from "@/contexts";
import { useVisitors } from "@/hooks/queries/useVisitors.query";

import { GridRowModel } from "@mui/x-data-grid";
import {
  useAddAdmin,
  useDeleteAdmin,
  useDeleteUser,
  useUpdateUser,
} from "@/hooks/mutations";
import { useDeleteVisitor } from "@/hooks/mutations/useVisitors.mutation";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Clientes" },
];

function ClientesContent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();

  const { data, isLoading } = useUsers();
  const { data: visitorsData, isLoading: visitorsLoading } = useVisitors();

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [nameToDelete, setNameToDelete] = useState<string | null>(null);
  const [isVisitor, setIsVisitor] = useState(false);

  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab")
    ? parseInt(searchParams.get("tab")!)
    : 0;
  const [value, setValue] = useState(initialTab);

  const [enableOrDisableAdmin, setEnableOrDisableAdmin] = useState(false);
  const [userClicked, setUserClicked] = useState<User | null>(null);
  const [email, setEmail] = useState("");

  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: addAdmin } = useAddAdmin();
  const { mutateAsync: deleteAdmin } = useDeleteAdmin();

  const { mutateAsync: deleteVisitor } = useDeleteVisitor();

  const { updateAllUsers, updateUserToEdit, updateIsEditing } = useUserStore();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (data && data.length > 0) {
      updateAllUsers(data);
    }
  }, [data, updateAllUsers]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEditClick = (row: GridRowModel) => () => {
    updateUserToEdit(row as User);
    updateIsEditing(true);
    router.replace("/clientes/novo");
  };

  const handleDeleteClick = (row: GridRowModel, isVisitor?: boolean) => () => {
    setIdToDelete(row._id);
    setNameToDelete(row.name);
    setIsVisitor(isVisitor ?? false);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    if (isVisitor) {
      await deleteVisitor(idToDelete);
    } else {
      await deleteUser(idToDelete);
    }
    setOpenDeleteModal(false);
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
          userPayload: { isAdmin: true },
          userId: userClicked?._id ?? "",
        });
      } else {
        await deleteAdmin(userClicked?._id ?? "");
        await updateUser({
          userPayload: { isAdmin: false },
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
      <Stack>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              "& .Mui-selected": {
                backgroundColor: "background.paper",
                color: "text.primary",
                fontWeight: "bold",
              },
              "& .Mui-selected:hover": {
                backgroundColor: "background.paper",
                color: "text.primary",
                fontWeight: "bold",
              },
              "& .MuiTab-root": {
                backgroundColor: "background.paper",
                color: "text.primary",
              },
            }}
          >
            <Tab
              icon={<GroupOutlinedIcon />}
              label="Sócios"
              {...a11yProps(0)}
            />
            <Tab
              icon={<EmojiPeopleOutlinedIcon />}
              label="Visitantes"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          <TabelaCliente
            data={data}
            isLoading={isLoading}
            enableOrDisableAdmin={enableOrDisableAdmin}
            openModal={openModal}
            userClicked={userClicked}
            email={email}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleOpenModal={handleOpenModal}
            handleEnableOrDisableAdmin={handleEnableOrDisableAdmin}
            setEmail={setEmail}
            updateIsEditing={updateIsEditing}
            updateUserToEdit={updateUserToEdit}
            setOpenModal={setOpenModal}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} dir={theme.direction}>
          <TabelaVisitantes
            data={visitorsData}
            isLoading={visitorsLoading}
            handleDeleteClick={(row: GridRowModel) =>
              handleDeleteClick(row, true)
            }
          />
        </CustomTabPanel>
      </Stack>
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
      <DeleteModal
        title="cliente"
        nameToDelete={capitalizeFirstLastName(nameToDelete!)}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirmDelete={confirmDelete}
      />
    </ContentWrapper>
  );
}

export default function Clientes() {
  return (
    <Stack>
      <Suspense fallback={<Loading minHeight={200} />}>
        <ClientesContent />
      </Suspense>
    </Stack>
  );
}
