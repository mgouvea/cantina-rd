"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { capitalize, capitalizeFirstLastName } from "@/utils";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Filters } from "../../filters/Filters";
import { Order, ProductItem, TabelaProps } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

import {
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function OrderTable({
  data,
  isLoading,
  handleEditClick,
  handleDeleteClick,
  onClickNewOrder,
}: TabelaProps<Order> & {
  onClickNewOrder: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const queryClient = useQueryClient();

  const handleResetData = () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const columns: GridColDef[] = [
    {
      field: "buyerName",
      headerName: "Nome",
      width: isMobile ? 150 : isTablet ? 200 : 300,
      flex: 1,
      minWidth: 120,
      editable: true,
      renderCell: (params) => (
        <Typography sx={{ py: 0.5 }}>
          {capitalizeFirstLastName(params.value)}
        </Typography>
      ),
    },
    {
      field: "groupFamilyName",
      headerName: "Grupo Familiar",
      width: isMobile ? 150 : isTablet ? 180 : 200,
      flex: 0.8,
      minWidth: 120,
      editable: true,
      renderCell: (params) => (
        <Typography sx={{ py: 0.5 }}>{capitalize(params.value)}</Typography>
      ),
    },
    {
      field: "products",
      headerName: "Produtos",
      width: isMobile ? 180 : isTablet ? 250 : 300,
      flex: 1.5,
      minWidth: 150,
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
      width: isMobile ? 80 : 100,
      flex: 0.5,
      minWidth: 80,
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
      width: isMobile ? 80 : 100,
      flex: 0.5,
      minWidth: 80,
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
      width: isMobile ? 80 : 100,
      flex: 0.3,
      minWidth: 70,
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
        padding: { xs: 1, sm: 2 },
        height: "fit-content",
        width: "100%",
        overflowX: "auto",
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

        <Stack direction="row" alignItems="center">
          <Tooltip title="Adicionar nova fatura">
            <IconButton
              color="success"
              aria-label="Adicionar nova fatura"
              onClick={onClickNewOrder}
              sx={{ ml: 1 }}
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Recarregar dados">
            <IconButton
              aria-label="add"
              sx={{ color: "success.main" }}
              onClick={handleResetData}
            >
              <CachedOutlinedIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há compras para exibir" />
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
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 100}
                autoHeight
                disableColumnMenu={isMobile}
                sx={{
                  borderRadius: "16px",
                  width: "100%",
                  "& .MuiDataGrid-cell": {
                    wordBreak: "break-word",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor:
                      theme.palette.mode === "light" ? "#f5f5f5" : "#333",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    minHeight: "200px",
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: isMobile ? 5 : 15 },
                  },
                  columns: {
                    columnVisibilityModel: {
                      groupFamilyName: !isMobile,
                      createdAt: !(isMobile && !isTablet),
                    },
                  },
                  sorting: {
                    sortModel: [{ field: "createdAt", sort: "desc" }],
                  },
                }}
                pageSizeOptions={[5, 15, 25]}
              />
            )
          }
        </Filters>
      )}
    </Box>
  );
}
