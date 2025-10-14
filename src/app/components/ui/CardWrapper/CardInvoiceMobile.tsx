import { useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Collapse,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Text from "../text/Text";
import ConsumptionDetails, { ConsumptionByPerson } from "../consumption/ConsumptionDetails";
import type { User } from "@/types";

interface CardInvoiceMobileProps {
  groupFamilyName: string;
  dtStart: Date | string;
  dtEnd: Date | string;
  totalAmount: number;
  originalAmount?: number;
  appliedCredit?: number;
  paidAmount?: number;
  status: "OPEN" | "PARTIALLY_PAID" | "PAID";
  consumoPorPessoa?: ConsumptionByPerson;
  dataUser: User[] | null;
  sentByWhatsapp?: boolean;
  isSending?: boolean;
  disableSend?: boolean;
  disablePayment?: boolean;
  onDelete: () => void;
  onSend: () => void;
  onPayment: () => void;
}

const CardInvoiceMobile = ({
  groupFamilyName,
  dtStart,
  dtEnd,
  totalAmount,
  originalAmount,
  appliedCredit,
  paidAmount,
  status,
  consumoPorPessoa,
  dataUser,
  sentByWhatsapp,
  isSending,
  disableSend,
  disablePayment,
  onDelete,
  onSend,
  onPayment,
}: CardInvoiceMobileProps) => {
  const statusColor: Record<
    CardInvoiceMobileProps["status"],
    "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
  > = {
    OPEN: "error",
    PARTIALLY_PAID: "warning",
    PAID: "success",
  };

  const [showConsumption, setShowConsumption] = useState(false);

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, width: "100%" }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text variant="subtitle1">{groupFamilyName}</Text>
          <Chip
            label={
              status === "OPEN"
                ? "Em aberto"
                : status === "PARTIALLY_PAID"
                ? "Parcialmente pago"
                : "Pago"
            }
            color={statusColor[status]}
            size="small"
            sx={{ color: "#fff" }}
          />
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Início
            </Typography>
            <Text variant="body2">{format(new Date(dtStart), "dd/MM/yyyy", { locale: ptBR })}</Text>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Fim
            </Typography>
            <Text variant="body2">{format(new Date(dtEnd), "dd/MM/yyyy", { locale: ptBR })}</Text>
          </Box>
        </Stack>

        <Divider />

        <Box>
          {appliedCredit ? (
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                Original: R$ {(originalAmount ?? totalAmount).toFixed(2)}
              </Typography>
              <Typography variant="body2">Total: R$ {totalAmount.toFixed(2)}</Typography>
              <Typography variant="caption" color="info.main">
                Crédito: R$ {appliedCredit.toFixed(2)}
              </Typography>
            </Stack>
          ) : (
            <Text variant="body2">Total: R$ {totalAmount.toFixed(2)}</Text>
          )}

          {status === "PARTIALLY_PAID" && typeof paidAmount === "number" && (
            <Stack direction="row" spacing={2} mt={0.5}>
              <Typography variant="caption" color="success.main">
                Pago: R$ {paidAmount.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="error.main">
                Restante: R$ {(totalAmount - paidAmount).toFixed(2)}
              </Typography>
            </Stack>
          )}
        </Box>

        {consumoPorPessoa && (
          <Box>
            <Box
              onClick={() => setShowConsumption((prev: boolean) => !prev)}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="body2" color="primary.main">
                Ver consumo por pessoa
              </Typography>
            </Box>
            <Collapse in={showConsumption}>
              <ConsumptionDetails consumptionData={consumoPorPessoa} dataUser={dataUser} />
            </Collapse>
          </Box>
        )}

        <Divider />

        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
          <Tooltip title="Deletar fatura">
            <IconButton onClick={onDelete} size="small">
              <DeleteIcon sx={{ color: "#9B0B00" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={sentByWhatsapp ? "Já enviada" : "Enviar fatura"}>
            <span>
              <IconButton onClick={onSend} size="small" disabled={disableSend}>
                {isSending ? (
                  <CircularProgress size={20} color="success" />
                ) : (
                  <SendOutlinedIcon sx={{ color: disableSend ? "#ccc" : "#4caf50" }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Confirmar pagamento">
            <span>
              <IconButton onClick={onPayment} size="small" disabled={disablePayment}>
                <PriceCheckOutlinedIcon sx={{ color: disablePayment ? "#ccc" : "#1565c0" }} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CardInvoiceMobile;
