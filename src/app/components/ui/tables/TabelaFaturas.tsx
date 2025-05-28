"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Text from "../text/Text";
import { DeleteModal, Filtros, PaymentModal, useSnackbar } from "../..";
import { format } from "date-fns";
import { FullInvoiceResponse } from "@/types/invoice";
import { GroupFamily, User } from "@/types";
import { ptBR } from "date-fns/locale";
import { useDeleteInvoice, useSendInvoiceByWhatsApp } from "@/hooks/mutations";
import { useQueryClient } from "@tanstack/react-query";

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
  GridRowModel,
} from "@mui/x-data-grid";
import {
  capitalizeFirstLastName,
  findUserById,
  getGroupFamilyNameById,
} from "@/utils";

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
  const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);

  const { mutateAsync: deleteInvoice } = useDeleteInvoice();
  const { mutateAsync: sendInvoiceByWhatsApp } = useSendInvoiceByWhatsApp();

  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState<string | null>(
    null
  );
  const [invoiceNameToDelete, setInvoiceNameToDelete] = useState<string | null>(
    null
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const [invoiceValue, setInvoiceValue] = useState<number | null>(null);

  const handleDeleteClick = (row: GridRowModel) => async () => {
    setInvoiceIdToDelete(row._id);
    setInvoiceNameToDelete(row.ownerName);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = (_id: string) => async () => {
    try {
      await deleteInvoice(_id);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      showSnackbar({
        message: "Fatura deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
      setOpenDeleteModal(false);
      setInvoiceIdToDelete(null);
      setInvoiceNameToDelete(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = "Erro ao deletar fatura";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }

      showSnackbar({
        message: errorMessage,
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const handleConfirmPayment = (row: GridRowModel) => async () => {
    console.log("row", row);
    setInvoiceValue(row.totalAmount);
    setOpenPaymentModal(true);
  };

  const handleSendInvoiceClick = (_id: string) => async () => {
    try {
      setSendingInvoiceId(_id);
      await sendInvoiceByWhatsApp(_id);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      showSnackbar({
        message: "Fatura enviada com sucesso!",
        severity: "success",
        duration: 3000,
      });
    } catch (error) {
      showSnackbar({
        message: "Erro ao enviar fatura",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    } finally {
      setSendingInvoiceId(null);
    }
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
        const isSentByWhatsApp = Boolean(params.row.sentByWhatsapp);
        const isOpenStatus = params.row.status === "OPEN";
        const isDisabledSend = !isOpenStatus || isSentByWhatsApp;

        return [
          <Tooltip title="Deletar fatura" key={`delete-${params.id}`}>
            <GridActionsCellItem
              icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 27 }} />}
              label="Delete"
              onClick={handleDeleteClick(params.row)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Enviar fatura" key={`send-${params.id}`}>
            <GridActionsCellItem
              icon={
                sendingInvoiceId === String(params.id) ? (
                  <CircularProgress size={24} color="success" />
                ) : (
                  <SendOutlinedIcon
                    sx={{
                      color: isDisabledSend ? "#ccc" : "#4caf50",
                      fontSize: 27,
                    }}
                  />
                )
              }
              label="Enviar"
              onClick={handleSendInvoiceClick(String(params.id))}
              color="inherit"
              disabled={isDisabledSend || sendingInvoiceId !== null}
            />
          </Tooltip>,
          <Tooltip title="Confirmar pagamento" key={`confirm-${params.id}`}>
            <GridActionsCellItem
              icon={
                <PriceCheckOutlinedIcon
                  sx={{ color: "#1565c0", fontSize: 27 }}
                />
              }
              label="Confirmar"
              onClick={handleConfirmPayment(params.row)}
              color="inherit"
            />
          </Tooltip>,
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

      <DeleteModal
        title="fatura"
        openModal={openDeleteModal}
        nameToDelete={capitalizeFirstLastName(invoiceNameToDelete!)}
        setOpenModal={setOpenDeleteModal}
        onConfirmDelete={handleConfirmDelete(invoiceIdToDelete!)}
      />

      <PaymentModal
        openModal={openPaymentModal}
        ownerName={capitalizeFirstLastName(invoiceNameToDelete!)}
        invoiceValue={invoiceValue!}
        setOpenModal={setOpenPaymentModal}
        onConfirmPayment={handleConfirmPayment}
      />
    </Box>
  );
}
