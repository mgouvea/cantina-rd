"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Text from "../text/Text";
import { Filtros, useSnackbar } from "../..";
import { format } from "date-fns";
import { FullInvoiceResponse } from "@/types/invoice";
import { GroupFamily, User } from "@/types";
import { ptBR } from "date-fns/locale";

import {
  CircularProgress,
  Stack,
  Tooltip,
  Chip,
  Collapse,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  capitalizeFirstLastName,
  findUserById,
  getGroupFamilyNameById,
} from "@/utils";
import { useDeleteInvoice } from "@/hooks/mutations";
import { useQueryClient } from "@tanstack/react-query";

interface TabelaProps {
  data: FullInvoiceResponse[] | undefined;
  isLoading: boolean;
  groupFamilies: GroupFamily[];
  dataUser: User[] | null;
  onResetData: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ConsumptionEntry {
  date: string;
  products: Product[];
}

interface ConsumptionByPerson {
  [userId: string]: ConsumptionEntry[];
}

const ConsumptionDetails = ({
  consumptionData,
  dataUser,
}: {
  consumptionData: ConsumptionByPerson;
  dataUser: User[] | null;
}) => {
  const [expandedUser, setExpandedUser] = React.useState<string | null>(null);

  if (!consumptionData || Object.keys(consumptionData).length === 0) {
    return <Typography variant="body2">Nenhum consumo registrado</Typography>;
  }

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const calculateUserTotal = (entries: ConsumptionEntry[]): number => {
    return entries.reduce((total, entry) => {
      const entryTotal = entry.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      return total + entryTotal;
    }, 0);
  };

  return (
    <Box sx={{ maxHeight: 300, overflow: "auto", width: "100%" }}>
      {Object.entries(consumptionData).map(([userId, entries]) => {
        const userTotal = calculateUserTotal(entries);

        return (
          <Paper key={userId} sx={{ mb: 1, p: 1 }}>
            <Box
              onClick={() => toggleUserExpand(userId)}
              sx={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2">
                Membro:{" "}
                {capitalizeFirstLastName(findUserById(userId, dataUser)?.name)}
              </Typography>
              <Chip
                label={`R$ ${userTotal.toFixed(2)}`}
                color="primary"
                size="small"
              />
            </Box>

            <Collapse in={expandedUser === userId}>
              <List dense>
                {entries.map((entry, entryIndex) => (
                  <React.Fragment key={entryIndex}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {format(new Date(entry.date), "dd/MM/yyyy HH:mm", {
                              locale: ptBR,
                            })}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                    {entry.products.map((product, productIndex) => (
                      <ListItem key={productIndex} sx={{ pl: 4 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {product.name} - {product.quantity}x R${" "}
                              {product.price.toFixed(2)}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Total: R${" "}
                              {(product.price * product.quantity).toFixed(2)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                    {entryIndex < entries.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
};

export default function TabelaFaturas({
  data,
  isLoading,
  groupFamilies,
  dataUser,
  onResetData,
}: TabelaProps) {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteInvoice } = useDeleteInvoice();

  const handleDeleteClick = (_id: string) => async () => {
    try {
      await deleteInvoice(_id);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      showSnackbar({
        message: "Fatura deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
    } catch (error) {
      showSnackbar({
        message: "Erro ao deletar fatura",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const handleSendInvoiceClick = (_id: string) => async () => {
    console.log("Send invoice", _id);
    showSnackbar({
      message: "Fatura enviada com sucesso!",
      severity: "success",
      duration: 3000,
    });
  };

  const handleResetData = () => {
    onResetData();
  };

  const columns: GridColDef[] = [
    {
      field: "groupFamilyId",
      headerName: "Grupo Familiar",
      width: 120,
      editable: false,
      sortable: true,
      align: "center",
      renderCell: (params) =>
        getGroupFamilyNameById(params.value, groupFamilies),
    },
    {
      field: "startDate",
      headerName: "Data de início",
      width: 120,
      editable: false,
      align: "center",
      renderCell: (params) =>
        format(new Date(params.value), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      field: "endDate",
      headerName: "Data de fim",
      width: 120,
      editable: false,
      align: "center",
      renderCell: (params) =>
        format(new Date(params.value), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      field: "consumoPorPessoa",
      headerName: "Consumo por pessoa",
      width: 400,
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title="Clique para ver detalhes" arrow placement="top">
          <Box sx={{ width: "100%" }}>
            <ConsumptionDetails
              consumptionData={params.value}
              dataUser={dataUser}
            />
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Valor total",
      width: 120,
      align: "center",
      editable: false,
      renderCell: (params) => `R$ ${params.value.toFixed(2)}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.value as "OPEN" | "PARTIALLY_PAID" | "PAID";
        let color:
          | "default"
          | "primary"
          | "secondary"
          | "error"
          | "info"
          | "success"
          | "warning" = "default";
        if (status === "OPEN") color = "error";
        if (status === "PARTIALLY_PAID") color = "warning";
        if (status === "PAID") color = "success";

        const statusLabels: Record<"OPEN" | "PARTIALLY_PAID" | "PAID", string> =
          {
            OPEN: "Em aberto",
            PARTIALLY_PAID: "Parcialmente pago",
            PAID: "Pago",
          };

        return (
          <Chip
            label={statusLabels[status] || status}
            color={color}
            size="small"
            sx={{
              color: "#fff",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 120,
      cellClassName: "actions",
      getActions: (params) => {
        return [
          <GridActionsCellItem
            key={`delete-${params.id}`}
            icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 27 }} />}
            label="Delete"
            onClick={handleDeleteClick(String(params.id))}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`send-${params.id}`}
            icon={<SendOutlinedIcon sx={{ color: "#4caf50", fontSize: 27 }} />}
            label="Send"
            onClick={handleSendInvoiceClick(String(params.id))}
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
        <Text variant="h5">Faturas Registradas</Text>

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
        <EmptyContent title="Ainda não há faturas registradas" />
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
