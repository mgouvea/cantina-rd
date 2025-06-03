"use client";

import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize } from "@/utils";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Filtros } from "../..";
import { OrderVisitor, ProductItem, TabelaProps } from "@/types";

export default function TabelaComprasVisitors({
  data,
  isLoading,
  handleEditClick,
  handleDeleteClick,
}: TabelaProps<OrderVisitor>) {
  const columns: GridColDef[] = [
    {
      field: "buyerName",
      headerName: "Nome",
      width: 350,
      editable: true,
      renderCell: (params) => (
        <Typography sx={{ py: 0.5 }}>{capitalize(params.value)}</Typography>
      ),
    },
    {
      field: "churchCore",
      headerName: "Núcleo",
      width: 250,
      editable: true,
      renderCell: (params) => capitalize(params.value),
    },
    {
      field: "products",
      headerName: "Produtos",
      width: 300,
      align: "center",
      headerAlign: "center",
      editable: true,
      renderCell: (params) => {
        if (
          !params.value ||
          !Array.isArray(params.value) ||
          params.value.length === 0
        ) {
          return "-";
        }

        // Display each product with its name and quantity
        return (
          <Stack spacing={0.5} sx={{ width: "100%", py: 0.5 }}>
            {params.value.map((prod: ProductItem, index: number) => {
              const quantity = prod.quantity || 1;
              return (
                <Box
                  key={prod._id || index}
                  sx={{
                    fontSize: "0.875rem",
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom:
                      params.value.length > 1 ? "1px dashed #eee" : "",
                    pb: params.value.length > 1 ? 0.5 : 0,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: quantity > 1 ? "bold" : "normal" }}
                  >
                    {capitalize(prod.name)}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {quantity > 1 ? `${quantity}x` : "1x"}
                  </Typography>
                </Box>
              );
            })}
            {params.value.length > 1 && (
              <Box
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  textAlign: "right",
                  pt: 0.5,
                }}
              >
                Total: {params.value.length} itens
              </Box>
            )}
          </Stack>
        );
      },
    },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 100,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ py: 0.5 }}>{`R$ ${params.value}`}</Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Data",
      width: 100,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography sx={{ py: 0.5 }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
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
            onClick={handleEditClick!(params.row)}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 25 }} />}
            label="Delete"
            onClick={handleDeleteClick!(params.row)}
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
        <Text variant="h5">Compras realizadas</Text>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há compras para exibir" />
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
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 100}
                sx={{ borderRadius: "16px" }}
              />
            )
          }
        </Filtros>
      )}
    </Box>
  );
}
