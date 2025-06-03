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
import { Filtros } from "../../filtros/Filtros";
import { Products } from "@/types";
import { useDeleteProduct } from "@/hooks/mutations/useProducts.mutation";
import { useProductStore } from "@/contexts";
import { useRouter } from "next/navigation";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  CircularProgress,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface TabelaProps {
  data: Products[];
  isLoading: boolean;
}

export default function TabelaProduto({ data, isLoading }: TabelaProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const { updateProductToEdit, updateIsEditing } = useProductStore();

  const handleEditClick = (row: Products) => () => {
    updateProductToEdit(row);
    updateIsEditing(true);
    router.replace("/produtos/novo");
  };

  const handleDeleteClick = (id: string) => async () => {
    await deleteProduct({ productId: id });
  };

  // Responsive column configuration
  const getColumnConfig = () => {
    const baseColumns: GridColDef<Products>[] = [
      {
        field: "urlImage",
        headerName: "Imagem",
        width: isMobile ? 60 : 100,
        editable: false,
        sortable: false,
        align: "center",
        renderCell: (params) => (
          <Image
            src={params.row.urlImage}
            alt={params.row.name}
            width={isMobile ? 40 : 55}
            height={isMobile ? 40 : 55}
            style={{ objectFit: "contain" }}
          />
        ),
      },
      {
        field: "name",
        headerName: "Nome",
        width: isMobile ? 120 : isTablet ? 150 : 200,
        editable: true,
        renderCell: (params) => (
          <div style={rowStyle}>{capitalize(params.value)}</div>
        ),
      },
      {
        field: "price",
        headerName: "Preço",
        width: isMobile ? 80 : 120,
        editable: true,
        renderCell: (params) => (
          <div style={rowStyle}>R$ {params.value ?? 0}</div>
        ),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "",
        width: 80,
        cellClassName: "actions",
        getActions: (params) => {
          return [
            <GridActionsCellItem
              key={`edit-${params.id}`}
              icon={<EditIcon sx={{ color: "#666666", fontSize: 25 }} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(params.row)}
            />,
            <GridActionsCellItem
              key={`delete-${params.id}`}
              icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 25 }} />}
              label="Delete"
              onClick={handleDeleteClick(params.id.toString())}
              color="inherit"
            />,
          ];
        },
      },
    ];

    // Add columns for non-mobile views
    if (!isMobile) {
      baseColumns.splice(2, 0, {
        field: "tag",
        headerName: "Tag",
        width: isTablet ? 70 : 100,
        editable: true,
        renderCell: (params) => (
          <div style={rowStyle}>{capitalize(params.value)}</div>
        ),
      });

      // Add category and subcategory for tablet and desktop
      if (!isTablet || theme.breakpoints.up("md")) {
        baseColumns.splice(
          3,
          0,
          {
            field: "categoryId",
            headerName: "Categoria",
            width: isTablet ? 100 : 120,
            editable: true,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              const category = params.row.categoryId;
              // Check if category is an object with a name property
              const categoryName =
                typeof category === "object" && category !== null
                  ? category.name
                  : "";
              return (
                <div style={{ ...rowStyle, textAlign: "center" }}>
                  {capitalize(categoryName)}
                </div>
              );
            },
          },
          {
            field: "subcategoryId",
            headerName: "Subcategoria",
            width: isTablet ? 100 : 120,
            editable: true,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              const subcategory = params.row.subcategoryId;
              // Check if subcategory is an object with a name property
              const subcategoryName =
                typeof subcategory === "object" && subcategory !== null
                  ? subcategory.name
                  : "";
              return (
                <div style={{ ...rowStyle, textAlign: "center" }}>
                  {capitalize(subcategoryName)}
                </div>
              );
            },
          }
        );
      }

      // Add description for desktop only
      if (!isTablet) {
        baseColumns.splice(3, 0, {
          field: "description",
          headerName: "Descrição",
          width: 300,
          editable: true,
          renderCell: (params) => (
            <div style={rowStyle}>{capitalize(params.value)}</div>
          ),
        });
      }
    }

    return baseColumns;
  };

  const columns = React.useMemo(
    () => getColumnConfig(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile, isTablet]
  );

  const handleAddProduto = () => {
    updateIsEditing(false);
    updateProductToEdit(null);
    router.replace("/produtos/novo");
  };

  return (
    <Box
      sx={{
        padding: isMobile ? 1 : 2,
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={isMobile ? 1 : 2}
      >
        <Text variant={isMobile ? "h6" : "h5"}>Produtos Cadastrados</Text>

        <IconButton
          aria-label="add"
          sx={{ color: "success.main" }}
          onClick={handleAddProduto}
        >
          <AddCircleIcon fontSize={isMobile ? "medium" : "large"} />
        </IconButton>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há produtos para exibir" />
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
                getRowId={(row) => row._id!}
                sx={{
                  borderRadius: "16px",
                  "& .MuiDataGrid-cell": {
                    padding: isMobile ? "4px" : "8px 16px",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #ccc",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    overflowX: "auto",
                  },
                }}
                density={isMobile ? "compact" : "standard"}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => (isMobile ? 70 : 100)}
                disableColumnMenu
                autoHeight
              />
            )
          }
        </Filtros>
      )}
    </Box>
  );
}

const rowStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  lineHeight: "1.2",
  padding: "8px 0",
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box" as const,
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical" as const,
};
