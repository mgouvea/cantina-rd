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
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridColDef,
} from "@mui/x-data-grid";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils";
import { Categories, Products, SubCategories } from "@/types/products";
import EmptyContent from "../emptyContent/EmptyContent";
import Image from "next/image";
import { Filtros } from "../../filtros/Filtros";
import Text from "../text/Text";

interface TabelaProps {
  data: Products[];
  isLoading: boolean;
  categories: Categories[];
  subcategories: SubCategories[];
}

export default function TabelaProduto({
  data,
  isLoading,
  categories,
  subcategories,
}: TabelaProps) {
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
    router.replace(`/produtos/editar/${id}`);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    console.log("Delete row with id: ", id);
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

  const columns: GridColDef<Products>[] = [
    {
      field: "imageBase64",
      headerName: "Imagem",
      width: 100,
      editable: false,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Image
          src={`data:image/${params.row.imageBase64}`}
          alt={params.row.name}
          width={55}
          height={55}
        />
      ),
    },
    {
      field: "name",
      headerName: "Nome",
      width: 200,
      editable: true,
      renderCell: (params) => (
        <div style={rowStyle}>{capitalize(params.value)}</div>
      ),
    },
    {
      field: "description",
      headerName: "Descrição",
      width: 300,
      editable: true,
      renderCell: (params) => (
        <div style={rowStyle}>{capitalize(params.value)}</div>
      ),
    },
    {
      field: "price",
      headerName: "Preço unitário",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <div style={rowStyle}>R$ {params.value ?? 0}</div>
      ),
    },
    {
      field: "categoryId",
      headerName: "Categoria",
      width: 200,
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
          <div style={{ paddingTop: "8px" }}>
            {capitalize(category?.name || "")}
          </div>
        );
      },
    },
    {
      field: "subcategoryId",
      headerName: "Subcategoria",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const subcategoryId = params.row.subcategoryId;
        const subcategory =
          typeof subcategoryId === "string"
            ? subcategories?.find((subcat) => subcat._id === subcategoryId)
            : subcategoryId;

        return (
          <div style={{ paddingTop: "8px" }}>
            {capitalize(subcategory?.name || "")}
          </div>
        );
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

  const handleAddProduto = () => {
    router.replace("/produtos/novo");
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
        <Text variant="h5">Produtos Cadastrados</Text>

        <IconButton
          aria-label="add"
          sx={{ color: "success.main" }}
          onClick={handleAddProduto}
        >
          <AddCircleIcon fontSize="large" />
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
                sx={{ borderRadius: "16px" }}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 100}
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
