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
import { Filtros } from "../..";
import { useCategoryStore, useSubCategoryStore } from "@/contexts";
import { useDeleteSubCategory } from "@/hooks/mutations";
import { useRouter } from "next/navigation";

import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";

interface TabelaProps {
  data: Categories[];
  isLoading: boolean;
}

export default function TabelaSubcategorias({ data, isLoading }: TabelaProps) {
  const router = useRouter();

  const { mutateAsync: deleteSubCategory } = useDeleteSubCategory();

  const { category } = useCategoryStore();
  const { updateIsEditing, updateSubCategoryToEdit } = useSubCategoryStore();

  const handleEditClick = (row: SubCategories, tab: number) => () => {
    updateIsEditing(true);
    updateSubCategoryToEdit(row);
    router.replace(`/categorias/novo?tab=${tab}`);
  };

  const handleDeleteClick = (id: string) => async () => {
    await deleteSubCategory(id);
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
                getRowId={(row) => row._id}
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
