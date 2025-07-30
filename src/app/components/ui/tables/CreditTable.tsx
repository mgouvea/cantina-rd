"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import { CreditModal } from "../../modal/CreditModal";
import { CreditResponse } from "@/types/credit";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Filters } from "../../filters/Filters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TabelaProps } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function CreditTable({
  data,
  isLoading,
}: TabelaProps<CreditResponse>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const queryClient = useQueryClient();

  const [openCreditModal, setOpenCreditModal] = useState(false);

  const handleResetData = () => {
    queryClient.invalidateQueries({ queryKey: ["credits"] });
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
      field: "creditedAmount",
      headerName: "Valor total",
      width: isMobile ? 100 : isTablet ? 120 : 130,
      flex: 0.8,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>R$ {Number(value).toFixed(2)}</Typography>
      ),
    },
    {
      field: "amount",
      headerName: "Valor atual",
      width: isMobile ? 100 : isTablet ? 120 : 130,
      flex: 0.8,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>R$ {Number(value).toFixed(2)}</Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Data de crédito",
      width: isMobile ? 80 : 100,
      flex: 1,
      minWidth: 80,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>
          {format(new Date(value), "dd/MM/yyyy HH:mm", { locale: ptBR })}
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
        <Text variant="h5">Créditos</Text>

        <Stack direction="row" spacing={2}>
          <Tooltip title="Inserir crédito">
            <IconButton
              aria-label="add"
              sx={{ color: "success.main" }}
              onClick={() => setOpenCreditModal(true)}
            >
              <AddCircleIcon fontSize="large" />
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
        <EmptyContent title="Ainda não há créditos para exibir" />
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
      <CreditModal
        openModal={openCreditModal}
        setOpenModal={setOpenCreditModal}
      />
    </Box>
  );
}
