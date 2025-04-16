"use client";

import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize } from "@/utils";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { Client } from "@/types/client";
import { Filtros, useSnackbar } from "../..";
import { useGroupFamily } from "@/hooks/queries/useGroupFamily.query";
import { useRouter } from "next/navigation";

import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useUserStore } from "@/contexts/store/users.store";
import { GroupFamily, User } from "@/types";
import {
  useAddAdmin,
  useDeleteAdmin,
  useDeleteUser,
  useRemoveMemberFromGroupFamily,
  useUpdateUser,
} from "@/hooks/mutations";
import GenericModal from "../../modal/GenericModal";
import { useQueryClient } from "@tanstack/react-query";
interface TabelaProps {
  data: Client[];
  isLoading: boolean;
  onDeleteUser: () => void;
}

export default function TabelaCliente({
  data,
  isLoading,
  onDeleteUser,
}: TabelaProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
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
      await removeMemberFromGroupFamily({ id: userId });
      onDeleteUser();
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

  const columns: GridColDef[] = [
    {
      field: "imageBase64",
      headerName: "Imagem",
      width: 100,
      editable: false,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Avatar
          alt="Foto do Perfil"
          sx={{
            width: 50,
            height: 50,
            cursor: "default",
          }}
          src={`data:image/${params.row.imageBase64}`}
        />
      ),
    },
    {
      field: "name",
      headerName: "Nome",
      width: 350,
      editable: true,
      renderCell: (params) => capitalize(params.value),
    },
    {
      field: "telephone",
      headerName: "Telefone",
      type: "number",
      width: 200,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "groupFamily",
      headerName: "Grupo Familiar",
      width: 200,
      editable: true,
      renderCell: (params) => {
        const group = groupFamilies?.find(
          (group: GroupFamily) => group._id === params.value
        );
        return group ? capitalize(group.name) : "-";
      },
    },
    {
      field: "isAdmin",
      headerName: "Administrador",
      type: "boolean",
      width: 150,
      align: "center",
      headerAlign: "center",
      editable: true,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleOpenModal(params.row)}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon sx={{ color: "#666666" }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.row)}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon sx={{ color: "#9B0B00" }} />}
            label="Delete"
            onClick={handleDeleteClick(String(params.id))}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleAddClient = () => {
    updateIsEditing(false);
    updateUserToEdit(null);
    router.replace("/clientes/novo");
  };

  return (
    <Box
      sx={{
        padding: 2,
        height: "fit-content",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5">Clientes Cadastrados</Text>

        <IconButton
          aria-label="add"
          sx={{ color: "success.main" }}
          onClick={handleAddClient}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há clientes para exibir" />
      )}

      {!isLoading && data && data.length > 0 && (
        <Filtros rows={data}>
          {(rowsFiltradas) =>
            isLoading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={rowsFiltradas}
                columns={columns}
                editMode="row"
                getRowId={(row) => row._id}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
                sx={{ borderRadius: "16px" }}
                rowHeight={60}
              />
            )
          }
        </Filtros>
      )}

      <GenericModal
        title={
          enableOrDisableAdmin
            ? "Habilitar administrador"
            : "Desabilitar administrador"
        }
        open={openModal}
        handleClose={() => {
          setOpenModal(false);
          setEmail("");
        }}
        cancelButtonText="Cancelar"
        confirmButtonText={enableOrDisableAdmin ? "Habilitar" : "Desabilitar"}
        buttonColor={enableOrDisableAdmin ? "success" : "error"}
        handleConfirm={handleEnableOrDisableAdmin}
      >
        <Stack sx={{ flexDirection: "column", gap: 3 }}>
          <Text>
            Você realmete deseja{" "}
            {enableOrDisableAdmin ? "habilitar" : "desabilitar"} esse
            administrador?
          </Text>

          {enableOrDisableAdmin && (
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </Stack>
      </GenericModal>
    </Box>
  );
}
