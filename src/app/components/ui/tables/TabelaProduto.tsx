"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  GridRowModesModel,
  DataGrid,
  GridEventListener,
  GridActionsCellItem,
  GridRowModel,
  GridRowEditStopReasons,
  GridColDef,
} from "@mui/x-data-grid";
import {
  CircularProgress,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils";
import { Categories, Products, SubCategories } from "@/types/products";
import EmptyContent from "../emptyContent/EmptyContent";
import Image from "next/image";
import { Filtros } from "../../filtros/Filtros";
import Text from "../text/Text";
import { useProductStore } from "@/contexts/store/products.store";
import { useDeleteProduct } from "@/hooks/mutations/useProducts.mutation";

interface TabelaProps {
  data: Products[];
  isLoading: boolean;
  categories: Categories[];
  subcategories: SubCategories[];
  onDeleteProduct: () => void;
}

export default function TabelaProduto({
  data,
  isLoading,
  categories,
  subcategories,
  onDeleteProduct,
}: TabelaProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const [rows, setRows] = React.useState(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const { updateProductToEdit, updateIsEditing } = useProductStore();

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row: Products) => () => {
    updateProductToEdit(row);
    updateIsEditing(true);
    router.replace("/produtos/novo");
  };

  const handleDeleteClick = (id: string) => async () => {
    await deleteProduct({ productId: id });
    onDeleteProduct();
  };

  const processRowUpdate = (newRow: GridRowModel<Products>) => {
    const updatedRow: Products = {
      ...(newRow as Products),
      updatedAt: new Date(),
    };
    setRows(
      rows.map((row: Products) => (row._id === newRow._id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Responsive column configuration
  const getColumnConfig = () => {
    const baseColumns: GridColDef<Products>[] = [
      {
        field: "imageBase64",
        headerName: "Imagem",
        width: isMobile ? 60 : 100,
        editable: false,
        sortable: false,
        align: "center",
        renderCell: (params) => (
          <Image
            src={`data:image/${params.row.imageBase64}`}
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
              icon={<EditIcon sx={{ color: "#666666" }} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(params.row)}
            />,
            <GridActionsCellItem
              key={`delete-${params.id}`}
              icon={<DeleteIcon sx={{ color: "#9B0B00" }} />}
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
              const categoryId = params.row.categoryId;
              const category =
                typeof categoryId === "string"
                  ? categories?.find((cat) => cat._id === categoryId)
                  : categoryId;

              return (
                <div style={{ ...rowStyle, textAlign: "center" }}>
                  {capitalize(category?.name || "")}
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
              const subcategoryId = params.row.subcategoryId;
              const subcategory =
                typeof subcategoryId === "string"
                  ? subcategories?.find(
                      (subcat) => subcat._id === subcategoryId
                    )
                  : subcategoryId;

              return (
                <div style={{ ...rowStyle, textAlign: "center" }}>
                  {capitalize(subcategory?.name || "")}
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
    [isMobile, isTablet, categories, subcategories]
  );

  const handleAddProduto = () => {
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
                editMode="row"
                getRowId={(row) => row._id!}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
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
