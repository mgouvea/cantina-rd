"use client";

import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PaymentResponse, TabelaProps } from "@/types";
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
import { Filters } from "../../filters/Filters";

export default function PaymentTable({
  data,
  isLoading,
}: TabelaProps<PaymentResponse>) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleResetData = () => {
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };

  const columns: GridColDef[] = [
    {
      field: "groupFamilyName",
      headerName: "Grupo familiar",
      width: isMobile ? 150 : isTablet ? 150 : 200,
      flex: 1,
      minWidth: 120,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>{value}</Typography>
      ),
    },
    {
      field: "invoicePeriod",
      headerName: "Período",
      width: isMobile ? 150 : isTablet ? 150 : 200,
      flex: 1,
      minWidth: 120,
      editable: true,
      renderCell: ({ value }) => {
        const startDate = new Date(value.startDate).toLocaleDateString("pt-BR");
        const endDate = new Date(value.endDate).toLocaleDateString("pt-BR");

        return (
          <Typography sx={{ py: 0.5 }}>
            {startDate} - {endDate}
          </Typography>
        );
      },
    },
    {
      field: "invoiceTotalAmount",
      headerName: "Valor total",
      width: isMobile ? 100 : isTablet ? 120 : 130,
      flex: 0.8,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>R$ {value}</Typography>
      ),
    },
    {
      field: "amountPaid",
      headerName: "Valor pago",
      width: isMobile ? 100 : isTablet ? 120 : 130,
      flex: 0.8,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>R$ {value}</Typography>
      ),
    },
    {
      field: "isPartial",
      headerName: "Pagamento parcial",
      width: isMobile ? 100 : isTablet ? 120 : 130,
      flex: 0.8,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>{value ? "Sim" : "Não"}</Typography>
      ),
    },
    {
      field: "paymentDate",
      headerName: "Data pagamento",
      width: isMobile ? 80 : 100,
      flex: 1,
      minWidth: 80,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
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
        <Text variant="h5">Pagamentos</Text>

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

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há pagamentos para exibir" />
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
                    paginationModel: { pageSize: isMobile ? 5 : 10 },
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
