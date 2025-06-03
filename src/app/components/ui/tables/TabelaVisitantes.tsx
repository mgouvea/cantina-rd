"use client";

import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize, formatarTelefone } from "@/utils";
import { CircularProgress, Stack } from "@mui/material";
import { Filtros } from "../..";

import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
  GridEventListener,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { Visitor } from "@/types/visitors";
interface TabelaProps {
  data: Visitor[];
  isLoading: boolean;
  rowModesModel: GridRowModesModel;
  handleDeleteClick: (row: GridRowModel, isVisitor?: boolean) => () => void;
  handleRowEditStop: GridEventListener<"rowEditStop">;
  handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
  processRowUpdate: (newRow: GridRowModel) => GridRowModel;
  setRowModesModel: (rowModesModel: GridRowModesModel) => void;
  setRows: (rows: Visitor[]) => void;
}

export default function TabelaVisitantes({
  data,
  isLoading,
  rowModesModel,
  handleDeleteClick,
  handleRowEditStop,
  handleRowModesModelChange,
  setRowModesModel,
  processRowUpdate,
  setRows,
}: TabelaProps) {
  const columns: GridColDef[] = [
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
      field: "churchCore",
      headerName: "Núcleo",
      width: 200,
      align: "left",
      headerAlign: "left",
      editable: true,
      renderCell: (params) => capitalize(params.value),
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
            icon={<DeleteIcon sx={{ color: "#9B0B00" }} />}
            label="Delete"
            onClick={handleDeleteClick(row, true)}
            color="inherit"
          />,
        ];
      },
    },
  ];

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
        <Text variant="h5">Visitantes Cadastrados</Text>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há visitantes para exibir" />
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
    </Box>
  );
}
