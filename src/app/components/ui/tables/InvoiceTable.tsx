"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EmptyContent from "../emptyContent/EmptyContent";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import React, { useEffect, useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Text from "../text/Text";
import WhatsAppResendIcon from "../icons/WhatsAppResendIcon";
import { DeleteModal } from "../../modal/DeleteModal";
import { Filters } from "../../filters/Filters";
import { format } from "date-fns";
import { PaymentModal } from "../../modal/PaymentModal";
import { ptBR } from "date-fns/locale";

import { CreatePaymentDto, FullInvoiceResponse, GroupFamily, User } from "@/types";

import {
  useAddPayment,
  useDeleteInvoice,
  useResetWhatsAppInvoice,
  useSendInvoiceByWhatsApp,
} from "@/hooks/mutations";

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
import { capitalizeFirstLastName, findUserById, getGroupFamilyNameById } from "@/utils";

interface TabelaProps {
  data: FullInvoiceResponse[] | undefined;
  isLoading: boolean;
  groupFamilies: GroupFamily[];
  dataUser: User[] | null;
  onResetData: () => void;
  setOpenModal: (open: boolean) => void;
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
                Membro: {capitalizeFirstLastName(findUserById(userId, dataUser)?.name)}
              </Typography>
              <Chip label={`R$ ${userTotal.toFixed(2)}`} color="primary" size="small" />
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
                              {product.name} - {product.quantity}x R$ {product.price.toFixed(2)}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              Total: R$ {(product.price * product.quantity).toFixed(2)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                    {entryIndex < entries.length - 1 && <Divider sx={{ my: 1 }} />}
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

export default function InvoiceTable({
  data,
  isLoading,
  groupFamilies,
  dataUser,
  viewInvoiceArchive,
  onViewInvoiceArchive,
  onResetData,
  setOpenModal,
}: TabelaProps & {
  viewInvoiceArchive: boolean;
  onViewInvoiceArchive: () => void;
}) {
  const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);

  const { mutateAsync: deleteInvoice } = useDeleteInvoice();
  const { mutateAsync: sendInvoiceByWhatsApp } = useSendInvoiceByWhatsApp();
  const { mutateAsync: resetWhatsAppInvoice, isPending: isLoadingResetWhatsAppInvoice } =
    useResetWhatsAppInvoice();
  const { mutateAsync: confirmPayment } = useAddPayment();

  const [invoiceIdToDelete, setInvoiceIdToDelete] = useState<string | null>(null);
  const [invoiceNameToDelete, setInvoiceNameToDelete] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const [invoiceValue, setInvoiceValue] = useState<number | null>(null);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleDeleteClick = (row: GridRowModel) => async () => {
    setInvoiceIdToDelete(row._id);
    setInvoiceNameToDelete(row.ownerName);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = (_id: string) => async () => {
    await deleteInvoice(_id);

    setOpenDeleteModal(false);
    setInvoiceIdToDelete(null);
    setInvoiceNameToDelete(null);
  };

  const handlePaymentClick = (row: GridRowModel) => async () => {
    setInvoiceValue(row.totalAmount);
    setPaymentId(row._id);

    // Calcular o valor total já pago para esta fatura
    const totalPaid =
      row.payments?.reduce(
        (sum: number, payment: { amountPaid: number }) => sum + payment.amountPaid,
        0
      ) || 0;

    setPaidAmount(totalPaid);
    setOpenPaymentModal(true);
  };

  const handleConfirmPayment = async (modalData: {
    paymentType: "total" | "partial" | "over";
    partialValue?: number;
    baseAmount?: number;
  }) => {
    // Retornando uma Promise para que o modal possa aguardar sua conclusão
    return new Promise<void>(async (resolve, reject) => {
      try {
        // Definir o valor a ser pago de acordo com o tipo de pagamento
        const remainingAmount = invoiceValue! - (paidAmount || 0)!;
        let amountPaid: number;
        let isPartial = false;
        let isCredit = false;

        if (modalData.paymentType === "total") {
          // Se já houver pagamentos, paga apenas o restante; caso contrário, paga o total
          amountPaid = paidAmount! > 0 ? remainingAmount : invoiceValue!;
        } else if (modalData.paymentType === "partial") {
          amountPaid = modalData.partialValue!;
          isPartial = true;
        } else {
          // over: pagamento acima do total/restante vira crédito
          amountPaid = modalData.partialValue!;
          // Opcionalmente, se quiser calcular o excedente:
          // const creditExcedente = modalData.baseAmount ? modalData.partialValue! - modalData.baseAmount : undefined;
          isCredit = true;
        }

        const paymentData: CreatePaymentDto = {
          invoiceId: paymentId!,
          amountPaid: amountPaid,
          baseAmount: modalData.baseAmount,
          paymentDate: new Date(),
          isPartial: isPartial,
          isCredit: isCredit,
        };
        await confirmPayment(paymentData);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleSendInvoiceClick = (_id: string) => async () => {
    setSendingInvoiceId(_id);
    await sendInvoiceByWhatsApp(_id);
    setSendingInvoiceId(null);
  };

  const handleResetData = () => {
    onResetData();
  };

  const handleEnableResendInvoice = async () => {
    await resetWhatsAppInvoice();
    handleResetData();
  };

  const useResponsiveColumns = () => {
    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    useEffect(() => {
      // Só roda no client!
      const handleResize = () => setWindowWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Trate o valor durante SSR:
    return windowWidth ? windowWidth < 1200 : false;
  };

  const isSmallScreen = useResponsiveColumns();

  const columns: GridColDef[] = [
    {
      field: "groupFamilyId",
      headerName: "Grupo Familiar",
      width: isSmallScreen ? 100 : 120,
      editable: false,
      sortable: true,
      align: "center",
      renderCell: (params) => getGroupFamilyNameById(params.value, groupFamilies),
    },
    {
      field: "startDate",
      headerName: "Data de início",
      width: isSmallScreen ? 100 : 120,
      editable: false,
      align: "center",
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      field: "endDate",
      headerName: "Data de fim",
      width: isSmallScreen ? 100 : 120,
      editable: false,
      align: "center",
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      field: "consumoPorPessoa",
      headerName: "Consumo por pessoa",
      width: isSmallScreen ? 250 : 350,
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title="Clique para ver detalhes" arrow placement="top">
          <Box sx={{ width: "100%" }}>
            <ConsumptionDetails consumptionData={params.value} dataUser={dataUser} />
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Valor total",
      width: isSmallScreen ? 120 : 150,
      align: "center",
      editable: false,
      renderCell: (params) => {
        const { row } = params;
        const totalAmount = params.value;
        const status = row.status as "OPEN" | "PARTIALLY_PAID" | "PAID";
        const hasAppliedCredit = row.appliedCredit && row.appliedCredit > 0;
        const originalAmount = row.originalAmount || totalAmount;
        const appliedCredit = row.appliedCredit || 0;

        // For simple cases (OPEN or PAID without credit), just show the total amount
        if ((status === "OPEN" || status === "PAID") && !hasAppliedCredit) {
          return `R$ ${totalAmount.toFixed(2)}`;
        }

        // Create a box to show detailed information
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Show original amount if credit was applied */}
            {hasAppliedCredit && (
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                Original: R$ {originalAmount.toFixed(2)}
              </Typography>
            )}

            {/* Always show total amount */}
            <Typography
              variant="caption"
              sx={{
                fontWeight: hasAppliedCredit ? "normal" : "bold",
                color: hasAppliedCredit ? "text.primary" : "inherit",
              }}
            >
              Total: R$ {totalAmount.toFixed(2)}
            </Typography>

            {/* Show credit if applied */}
            {hasAppliedCredit && (
              <Typography variant="caption" sx={{ color: "info.main" }}>
                Crédito: R$ {appliedCredit.toFixed(2)}
              </Typography>
            )}

            {/* For PARTIALLY_PAID, show paid and remaining amounts */}
            {status === "PARTIALLY_PAID" && (
              <>
                <Typography variant="caption" sx={{ color: "success.main" }}>
                  Pago: R$ {row.paidAmount.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ color: "error.main" }}>
                  Restante: R$ {(totalAmount - row.paidAmount).toFixed(2)}
                </Typography>
              </>
            )}
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: isSmallScreen ? 120 : 150,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.value as "OPEN" | "PARTIALLY_PAID" | "PAID";
        let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" =
          "default";
        if (status === "OPEN") color = "error";
        if (status === "PARTIALLY_PAID") color = "warning";
        if (status === "PAID") color = "success";

        const statusLabels: Record<"OPEN" | "PARTIALLY_PAID" | "PAID", string> = {
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
      width: isSmallScreen ? 100 : 120,
      cellClassName: "actions",
      getActions: (params) => {
        const isSentByWhatsApp = Boolean(params.row.sentByWhatsapp);
        const isOpenStatus = params.row.status === "OPEN" || params.row.status === "PARTIALLY_PAID";
        const isDisabledSend = !isOpenStatus || isSentByWhatsApp;
        const isDisabledPayment = params.row.status === "PAID";

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
                  sx={{
                    color: isDisabledPayment ? "#ccc" : "#1565c0",
                    fontSize: 27,
                  }}
                />
              }
              label="Confirmar"
              onClick={handlePaymentClick(params.row)}
              color="inherit"
              disabled={isDisabledPayment}
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
        width: "100%",
        overflow: "hidden",
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

        <Stack direction="row" alignItems="center">
          <Tooltip title={viewInvoiceArchive ? "Ver faturas em aberto" : "Ver faturas pagas"}>
            <IconButton
              aria-label="toggle-archive-view"
              sx={{ color: viewInvoiceArchive ? "#fff" : "warning.main" }}
              onClick={() => onViewInvoiceArchive()}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.3rem",
                  bgcolor: viewInvoiceArchive ? "error.main" : "transparent",
                  borderRadius: "8px",
                }}
              >
                <Inventory2OutlinedIcon fontSize="medium" />
              </Box>
            </IconButton>
          </Tooltip>
          <Tooltip title="Habilitar reenvio por WhatsApp">
            <div onClick={handleEnableResendInvoice}>
              <WhatsAppResendIcon isPending={isLoadingResetWhatsAppInvoice} />
            </div>
          </Tooltip>
          <Tooltip title="Adicionar nova fatura">
            <IconButton
              color="success"
              aria-label="Adicionar nova fatura"
              onClick={() => setOpenModal(true)}
              sx={{ ml: 1 }}
            >
              <AddCircleIcon />
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
        <EmptyContent title="Ainda não há faturas registradas" />
      )}

      {!isLoading && data && data.length > 0 && (
        <Filters rows={data} type="invoice">
          {(rowsFiltradas) =>
            isLoading ? (
              <CircularProgress />
            ) : (
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <DataGrid
                  rows={rowsFiltradas}
                  columns={columns}
                  editMode="row"
                  getRowId={(row) => row._id}
                  getRowHeight={() => "auto"}
                  getEstimatedRowHeight={() => 100}
                  autoHeight
                  disableColumnMenu={isSmallScreen}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "createdAt", sort: "desc" }],
                    },
                  }}
                  sx={{
                    borderRadius: "16px",
                    width: "100%",
                    "& .MuiDataGrid-main": {
                      overflow: "auto",
                    },
                    "& .MuiDataGrid-cell": {
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    },
                  }}
                />
              </Box>
            )
          }
        </Filters>
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
        paidAmount={paidAmount!}
        setOpenModal={setOpenPaymentModal}
        onConfirmPayment={handleConfirmPayment}
      />
    </Box>
  );
}
