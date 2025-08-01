"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize, formatarTelefone } from "@/utils";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { Client } from "@/types/client";

import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
} from "@mui/x-data-grid";
import { User } from "@/types";
import GenericModal from "../../modal/GenericModal";
import { useRouter } from "next/navigation";
import { Filters } from "../../filters/Filters";
interface TabelaProps {
  data: Client[];
  isLoading: boolean;
  enableOrDisableAdmin: boolean;
  openModal: boolean;
  userClicked: User | null;
  email: string;
  handleEditClick: (row: GridRowModel) => () => void;
  handleDeleteClick: (row: GridRowModel) => () => void;
  handleOpenModal: (row: User) => void;
  handleEnableOrDisableAdmin: () => void;
  setEmail: (email: string) => void;
  updateIsEditing: (isEditing: boolean) => void;
  updateUserToEdit: (user: User | null) => void;
  setOpenModal: (open: boolean) => void;
}

export default function TableClient({
  data,
  isLoading,
  enableOrDisableAdmin,
  openModal,
  email,
  handleEditClick,
  handleDeleteClick,
  handleOpenModal,
  handleEnableOrDisableAdmin,
  setEmail,
  updateIsEditing,
  updateUserToEdit,
  setOpenModal,
}: TabelaProps) {
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "urlImage",
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
          src={params.row.urlImage}
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
      renderCell: (params) => formatarTelefone(params.value),
    },
    {
      field: "groupFamilyName",
      headerName: "Grupo Familiar",
      width: 200,
      editable: true,
      renderCell: (params) => capitalize(params.value),
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
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon sx={{ color: "#666666" }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row)}
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon sx={{ color: "#9B0B00" }} />}
            label="Delete"
            onClick={handleDeleteClick(row)}
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
        <Text variant="h5">Sócios Cadastrados</Text>

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
        <Filters rows={data}>
          {(rowsFiltradas) =>
            isLoading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={rowsFiltradas}
                columns={columns}
                getRowId={(row) => row._id}
                sx={{ borderRadius: "16px" }}
                rowHeight={60}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "name", sort: "asc" }],
                  },
                }}
              />
            )
          }
        </Filters>
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
