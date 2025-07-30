"use client";

import * as React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Image from "next/image";
import Text from "../text/Text";
import { capitalize } from "@/utils";
import { Categories } from "@/types";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import { useCategoryStore } from "@/contexts";
import { useDeleteCategory } from "@/hooks/mutations";
import { useRouter } from "next/navigation";

import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Filters } from "../../filters/Filters";
interface TabelaProps {
  data: Categories[];
  isLoading: boolean;
}

export default function CategoriesTable({ data, isLoading }: TabelaProps) {
  const router = useRouter();

  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { updateCategoryToEdit, updateIsEditing } = useCategoryStore();

  const handleEditClick = (row: Categories) => () => {
    updateCategoryToEdit(row);
    updateIsEditing(true);
    router.replace("/categorias/novo");
  };

  const handleDeleteClick = (id: string) => async () => {
    await deleteCategory(id);
  };

  const columns: GridColDef[] = [
    {
      field: "urlImage",
      headerName: "Imagem",
      width: 100,
      editable: false,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Image
          alt="Foto do Perfil"
          width={50}
          height={50}
          src={params.row.urlImage}
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
            icon={<EditIcon sx={{ color: "#666666", fontSize: 25 }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.row)}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 25 }} />}
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
              />
            )
          }
        </Filters>
      )}
    </Box>
  );
}
