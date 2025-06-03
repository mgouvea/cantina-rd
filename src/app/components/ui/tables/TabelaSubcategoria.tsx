"use client";

import * as React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize, getCategoryNameById } from "@/utils";
import { Categories, SubCategories } from "@/types";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import { Filtros, useSnackbar } from "../..";
import { useCategoryStore, useSubCategoryStore } from "@/contexts";
import { useDeleteSubCategory } from "@/hooks/mutations";
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
  onDeleteSubCategory: () => void;
}

export default function TabelaSubcategorias({
  data,
  isLoading,
  onDeleteSubCategory,
}: TabelaProps) {
  const router = useRouter();
  const [rows, setRows] = React.useState<Categories[]>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const { mutateAsync: deleteSubCategory } = useDeleteSubCategory();

  const { category } = useCategoryStore();
  const { updateIsEditing, updateSubCategoryToEdit } = useSubCategoryStore();

  const { showSnackbar } = useSnackbar();

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row: SubCategories, tab: number) => () => {
    updateIsEditing(true);
    updateSubCategoryToEdit(row);
    router.replace(`/categorias/novo?tab=${tab}`);
  };

  const handleDeleteClick = (id: string) => async () => {
    try {
      await deleteSubCategory(id);
      onDeleteSubCategory();
      showSnackbar({
        message: "Subcategoria deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
    } catch (error) {
      showSnackbar({
        message: "Erro ao deletar subcategoria",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
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
        return capitalize(
          getCategoryNameById(params.value, category as unknown as Categories[])
        );
      },
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
            icon={<EditIcon sx={{ color: "#666666", fontSize: 25 }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row, 1)}
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 25 }} />}
            label="Delete"
            onClick={handleDeleteClick(String(id))}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleAddCategorias = (tab: number) => {
    updateIsEditing(false);
    updateSubCategoryToEdit(null);
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
