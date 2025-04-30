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
import { Filtros } from "../..";

import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
  GridEventListener,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { GroupFamily, User } from "@/types";
import GenericModal from "../../modal/GenericModal";
import { useRouter } from "next/navigation";
interface TabelaProps {
  data: Client[];
  isLoading: boolean;
  groupFamilies: GroupFamily[];
  enableOrDisableAdmin: boolean;
  openModal: boolean;
  userClicked: User | null;
  email: string;
  rowModesModel: GridRowModesModel;
  handleEditClick: (row: GridRowModel) => () => void;
  handleDeleteClick: (row: GridRowModel) => () => void;
  handleRowEditStop: GridEventListener<"rowEditStop">;
  handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
  handleOpenModal: (row: User) => void;
  handleEnableOrDisableAdmin: () => void;
  setEmail: (email: string) => void;
  processRowUpdate: (newRow: GridRowModel) => GridRowModel;
  updateIsEditing: (isEditing: boolean) => void;
  updateUserToEdit: (user: User | null) => void;
  setRowModesModel: (rowModesModel: GridRowModesModel) => void;
  setRows: (rows: Client[]) => void;
  setOpenModal: (open: boolean) => void;
}

export default function TabelaCliente({
  data,
  isLoading,
  groupFamilies,
  enableOrDisableAdmin,
  openModal,
  email,
  rowModesModel,
  handleEditClick,
  handleDeleteClick,
  handleRowEditStop,
  handleRowModesModelChange,
  handleOpenModal,
  handleEnableOrDisableAdmin,
  setEmail,
  updateIsEditing,
  updateUserToEdit,
  setRowModesModel,
  processRowUpdate,
  setRows,
  setOpenModal,
}: TabelaProps) {
  const router = useRouter();

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
      renderCell: (params) => formatarTelefone(params.value),
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
