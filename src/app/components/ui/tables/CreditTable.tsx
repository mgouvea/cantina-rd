"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Text from "../text/Text";
import { CreditModal } from "../../modal/CreditModal";
import { CreditMessage, CreditResponse } from "@/types/credit";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { Filters } from "../../filters/Filters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TabelaProps } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CardCreditMobile from "../CardWrapper/CardCreditMobile";

import {
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDeleteCredit, useSendCreditMessage } from "@/hooks/mutations";

export default function CreditTable({
  data,
  isLoading,
  viewCreditArchive,
  onViewCreditArchive,
}: TabelaProps<CreditResponse> & {
  viewCreditArchive: boolean;
  onViewCreditArchive: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const queryClient = useQueryClient();

  const [openCreditModal, setOpenCreditModal] = useState(false);
  const [sendingCreditId, setSendingCreditId] = useState<string | null>(null);

  const { mutateAsync: deleteCredit } = useDeleteCredit();
  const { mutateAsync: sendCreditMessage } = useSendCreditMessage();

  const handleResetData = () => {
    queryClient.invalidateQueries({ queryKey: ["credits"] });
  };

  const handleDeleteClick = (id: string) => async () => {
    try {
      await deleteCredit(id);
    } catch (error) {
      console.error("Error deleting credit:", error);
    }
  };

  const handleSendCreditMessage = (row: GridRowModel<CreditResponse>) => async () => {
    try {
      setSendingCreditId(String(row._id));
      const body: CreditMessage = {
        groupFamilyId: row.groupFamilyId,
        isAutomatic: false,
        addedValue: row.creditedAmount,
      };

      console.log(body);
      await sendCreditMessage(body);
    } catch (error) {
      console.error("Error deleting credit:", error);
    } finally {
      setSendingCreditId(null);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "groupFamilyName",
      headerName: "Grupo familiar",
      width: isMobile ? 150 : isTablet ? 150 : 200,
      flex: 1,
      minWidth: 120,
      editable: true,
      renderCell: ({ value }) => <Typography sx={{ py: 0.5 }}>{value}</Typography>,
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
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 80,
      cellClassName: "actions",
      getActions: (params) => {
        return [
          <Tooltip title="Excluir crédito" key={`delete-${params.id}`}>
            <GridActionsCellItem
              key={`delete-${params.id}`}
              icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 25 }} />}
              label="Delete"
              onClick={handleDeleteClick(params.id.toString())}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Enviar crédito" key={`send-${params.id}`}>
            <GridActionsCellItem
              icon={
                sendingCreditId === String(params.id) ? (
                  <CircularProgress size={24} color="success" />
                ) : (
                  <SendOutlinedIcon
                    sx={{
                      color: "#4caf50",
                      fontSize: 27,
                    }}
                  />
                )
              }
              label="Enviar"
              onClick={handleSendCreditMessage(params.row)}
              color="inherit"
              disabled={sendingCreditId !== null}
            />
          </Tooltip>,
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
        <Text
          variant={isMobile ? "subtitle2" : "h5"}
          sx={{
            fontWeight: { xs: "bold", sm: "normal" },
            pb: { xs: 2, sm: 0 },
          }}
        >
          {viewCreditArchive ? "Créditos arquivados" : "Créditos ativos"}
        </Text>

        <Stack direction="row" spacing={2}>
          <Tooltip title={viewCreditArchive ? "Creditos ativos" : "Creditos arquivados"}>
            <IconButton
              aria-label="add"
              sx={{ color: viewCreditArchive ? "#fff" : "warning.main" }}
              onClick={() => onViewCreditArchive()}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.3rem",
                  bgcolor: viewCreditArchive ? "error.main" : "transparent",
                  borderRadius: "8px",
                }}
              >
                <Inventory2OutlinedIcon fontSize="medium" />
              </Box>
            </IconButton>
          </Tooltip>
          <Tooltip title="Inserir crédito">
            <IconButton
              aria-label="add"
              sx={{ color: "success.main" }}
              onClick={() => setOpenCreditModal(true)}
            >
              <AddCircleIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Recarregar dados">
            <IconButton aria-label="add" sx={{ color: "success.main" }} onClick={handleResetData}>
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
            ) : isMobile ? (
              <Stack spacing={2} sx={{ mt: 1 }}>
                {(rowsFiltradas as CreditResponse[])
                  .filter((row) => Boolean(row._id))
                  .map((row) => (
                    <CardCreditMobile
                      key={row._id as string}
                      groupFamilyName={row.groupFamilyName}
                      creditedAmount={row.creditedAmount}
                      amount={row.amount}
                      createdAt={row.createdAt}
                      onDelete={handleDeleteClick(row._id as string)}
                      onSend={handleSendCreditMessage(row)}
                    />
                  ))}
              </Stack>
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
                    backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#333",
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
      <CreditModal openModal={openCreditModal} setOpenModal={setOpenCreditModal} />
    </Box>
  );
}
