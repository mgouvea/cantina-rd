"use client";

import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize, formatarTelefone } from "@/utils";
import { CircularProgress, Stack } from "@mui/material";
import { Filters } from "../../filters/Filters";
import { Visitor } from "@/types";

import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
} from "@mui/x-data-grid";
interface TabelaProps {
  data: Visitor[];
  isLoading: boolean;
  handleDeleteClick: (row: GridRowModel, isVisitor?: boolean) => () => void;
}

export default function VisitorTable({
  data,
  isLoading,
  handleDeleteClick,
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
        <Filters rows={data}>
          {(rowsFiltradas) =>
            isLoading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={rowsFiltradas}
                columns={columns}
                editMode="row"
                getRowId={(row) => row._id}
                sx={{ borderRadius: "16px" }}
                rowHeight={60}
              />
            )
          }
        </Filters>
      )}
    </Box>
  );
}
