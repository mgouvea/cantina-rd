"use client";

import * as React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { Avatar, CircularProgress, IconButton, Stack } from "@mui/material";
import { capitalize } from "@/utils";
import { Categories } from "@/types";
import { Filtros, useSnackbar } from "../..";
import { useCategoryStore } from "@/contexts/store/categories.store";
import { useDeleteCategory } from "@/hooks/mutations";
import { useRouter } from "next/navigation";

import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
  GridRowEditStopReasons,
  GridEventListener,
} from "@mui/x-data-grid";
interface TabelaProps {
  data: Categories[];
  isLoading: boolean;
  onDeleteCategory: () => void;
}

export default function TabelaCategorias({
  data,
  isLoading,
  onDeleteCategory,
}: TabelaProps) {
  const router = useRouter();

  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { showSnackbar } = useSnackbar();
  const { updateCategoryToEdit, updateIsEditing } = useCategoryStore();

  const [rows, setRows] = React.useState<Categories[]>(data);
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

  const handleEditClick = (row: Categories) => () => {
    updateCategoryToEdit(row);
    updateIsEditing(true);
    router.replace("/categorias/novo");
  };

  const handleDeleteClick = (id: string) => async () => {
    await deleteCategory(id);
    onDeleteCategory();

    showSnackbar({
      message: "Categorias e subcategorias deletadas com sucesso!",
      severity: "success",
      duration: 3000,
    });
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
      width: 500,
      editable: true,
      renderCell: (params) => capitalize(params.value),
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

  const handleAddCategorias = (tab: number) => {
    updateIsEditing(false);
    updateCategoryToEdit(null);
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
          onClick={() => handleAddCategorias(0)}
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
