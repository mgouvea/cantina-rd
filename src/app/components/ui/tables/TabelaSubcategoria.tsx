"use client";

import * as React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize, getCategoryNameById } from "@/utils";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import { Filtros } from "../..";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/queries";

import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridEventListener,
} from "@mui/x-data-grid";
import { Categories } from "@/types";

interface TabelaProps {
  data: Categories[];
  isLoading: boolean;
}

export default function TabelaSubcategorias({ data, isLoading }: TabelaProps) {
  const router = useRouter();
  const [rows, setRows] = React.useState<Categories[]>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  // Fetch categories to use for displaying category names
  const { data: categories } = useCategories();

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    router.replace(`/subcategorias/editar/${id}`);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    console.log("Delete row with id: ", id);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      rows.map((row: Categories) =>
        row._id === newRow._id ? updatedRow : row
      ) as Categories[]
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nome",
      width: 500,
      editable: true,
      renderCell: (params) => capitalize(params.value),
    },
    {
      field: "categoryId",
      headerName: "Categoria Pai",
      width: 500,
      editable: true,
      renderCell: (params) => {
        // Use the helper function to get the category name
        return capitalize(getCategoryNameById(params.value, categories || []));
      },
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

  const handleAddCategorias = (tab: number) => {
    router.replace(`/categorias/novo?tab=${tab}`);
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
        <Text variant="h5">Categorias Cadastradas</Text>

        <IconButton
          aria-label="add"
          sx={{ color: "success.main" }}
          onClick={() => handleAddCategorias(1)}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há categorias para exibir" />
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
