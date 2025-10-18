import { Stack, Box, Typography, Divider } from "@mui/material";
import Text from "../text/Text";

interface CardPaymentsMobileProps {
  isVisitor?: boolean;
  groupFamilyName?: string;
  visitorName?: string;
  invoicePeriod: { startDate: Date | string; endDate: Date | string };
  invoiceTotalAmount: number;
  amountPaid: number;
  isPartial: boolean;
  paymentDate: Date | string;
}

const CardPaymentsMobile = ({
  isVisitor,
  groupFamilyName,
  visitorName,
  invoicePeriod,
  invoiceTotalAmount,
  amountPaid,
  isPartial,
  paymentDate,
}: CardPaymentsMobileProps) => {
  const start = new Date(invoicePeriod.startDate).toLocaleDateString("pt-BR");
  const end = new Date(invoicePeriod.endDate).toLocaleDateString("pt-BR");
  const paymentDt = new Date(paymentDate).toLocaleDateString("pt-BR");

  return (
    <Stack sx={{ p: 2, borderRadius: 5, width: "100%", boxShadow: 2, border: "1px solid #f6f6f6" }}>
      <Stack spacing={1.25}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text variant="subtitle1">{isVisitor ? visitorName : groupFamilyName}</Text>
          <Typography variant="caption" color="text.secondary">
            {paymentDt}
          </Typography>
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Período
          </Typography>
          <Text variant="body2">
            {start} - {end}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Stack direction="row" justifyContent="space-between">
            <Text variant="body2">Valor total</Text>
            <Text variant="body2">R$ {invoiceTotalAmount}</Text>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Text variant="body2">Valor pago</Text>
            <Text variant="body2">R$ {amountPaid}</Text>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Text variant="body2">Pagamento parcial</Text>
            <Typography variant="body2">{isPartial ? "Sim" : "Não"}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default CardPaymentsMobile;
