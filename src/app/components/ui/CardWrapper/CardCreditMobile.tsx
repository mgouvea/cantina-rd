import { Stack, Box, Typography, Divider, IconButton, Tooltip } from "@mui/material";
import Text from "../text/Text";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

interface CardCreditMobileProps {
  groupFamilyName: string;
  creditedAmount: number;
  amount: number;
  createdAt?: Date | string;
  onDelete: () => void;
}

const CardCreditMobile = ({
  groupFamilyName,
  creditedAmount,
  amount,
  createdAt,
  onDelete,
}: CardCreditMobileProps) => {
  const created = createdAt ? new Date(createdAt).toLocaleDateString("pt-BR") : "-";

  return (
    <Stack sx={{ p: 2, borderRadius: 5, width: "100%", boxShadow: 2, border: "1px solid #f6f6f6" }}>
      <Stack spacing={1.25}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text variant="subtitle1">{groupFamilyName}</Text>
          <Typography variant="caption" color="text.secondary">
            {created}
          </Typography>
        </Stack>

        <Divider />

        <Box>
          <Stack direction="row" justifyContent="space-between">
            <Text variant="body2">Valor total creditado</Text>
            <Text variant="body2">R$ {Number(creditedAmount).toFixed(2)}</Text>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Text variant="body2">Valor atual</Text>
            <Text variant="body2">R$ {Number(amount).toFixed(2)}</Text>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="flex-end">
          <Tooltip title="Excluir crédito">
            <IconButton onClick={onDelete} size="small">
              <DeleteIcon sx={{ color: "#9B0B00" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CardCreditMobile;
