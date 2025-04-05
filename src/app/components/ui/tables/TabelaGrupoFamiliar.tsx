"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import { Filtros } from "../..";
import { useRouter } from "next/navigation";
import Text from "../text/Text";
import EmptyContent from "../emptyContent/EmptyContent";

interface TabelaProps {
  data: any;
  isLoading: boolean;
}

export default function TabelaGrupoFamiliar({ data, isLoading }: TabelaProps) {
  const router = useRouter();
  const [rows, setRows] = React.useState(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    router.replace(`/clientes/editar/${id}`);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    console.log("Delete row with id: ", id);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row: any) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const getOwnerName = (ownerId: string, row: any) => {
    const ownerMember = row.members.find(
      (member: any) => member.userId === ownerId
    );
    return ownerMember ? ownerMember.name : ownerId;
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nome", width: 300, editable: true },
    {
      field: "owner",
      headerName: "Responsável",
      type: "string",
      width: 300,
      editable: true,
      renderCell: (params) => getOwnerName(params.value, params.row),
    },
    {
      field: "members",
      headerName: "Membros",
      width: 250,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ py: 1, width: "100%" }}>
          {params.value.map((member: any, index: number) => (
            <div key={index}>{member.name}</div>
          ))}
        </Stack>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon sx={{ color: "#666666" }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon sx={{ color: "#9B0B00" }} />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleAddClient = () => {
    router.replace("/grupo-familiar/novo");
  };

  return (
    <Box
      sx={{
        padding: 2,
        height: "fit-content",
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5">Grupos Familiares Cadastrados</Text>

        <IconButton
          aria-label="add"
          sx={{ color: "success.main" }}
          onClick={handleAddClient}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há Grupos Familiares para exibir" />
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
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 100}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
                sx={{ borderRadius: "16px" }}
              />
            )
          }
        </Filtros>
      )}
    </Box>
  );
}
