import { Stack, Box, Typography, IconButton, Tooltip, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Text from "../text/Text";
import { capitalize, capitalizeFirstLastName } from "@/utils";
import type { ProductItem } from "@/types";

interface CardOrdersMobileProps {
  buyerName: string;
  groupFamilyName?: string;
  churchCore?: string;
  isVisitor?: boolean;
  products: ProductItem[];
  totalPrice: number;
  createdAt: string | Date;
  onEdit: () => void;
  onDelete: () => void;
}

const CardOrdersMobile = ({
  buyerName,
  groupFamilyName,
  churchCore,
  isVisitor,
  products,
  totalPrice,
  createdAt,
  onEdit,
  onDelete,
}: CardOrdersMobileProps) => {
  return (
    <Stack sx={{ p: 2, borderRadius: 5, width: "100%", boxShadow: 2, border: "1px solid #f6f6f6" }}>
      <Stack spacing={1.25}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text variant="subtitle1">{capitalizeFirstLastName(buyerName)}</Text>
          <Typography variant="caption" color="text.secondary">
            {new Date(createdAt).toLocaleDateString()}
          </Typography>
        </Stack>

        <Box>
          <Text variant="caption" color="text.secondary">
            {isVisitor ? "Núcleo" : "Grupo Familiar"}
          </Text>
          <Text variant="body2">{capitalize(isVisitor ? churchCore || "-" : groupFamilyName || "-")}</Text>
        </Box>

        <Divider />

        <Box>
          <Typography variant="caption" color="text.secondary">
            Produtos
          </Typography>
          {!products || products.length === 0 ? (
            <Text variant="body2">-</Text>
          ) : (
            <Stack spacing={0.5} sx={{ width: "100%", py: 0.5 }}>
              {products.map((prod: ProductItem, index: number) => {
                const quantity = prod.quantity || 1;
                return (
                  <Box
                    key={prod._id || index}
                    sx={{
                      fontSize: "0.875rem",
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: products.length > 1 ? "1px dashed #eee" : "",
                      pb: products.length > 1 ? 0.5 : 0,
                    }}
                  >
                    <Typography sx={{ fontWeight: quantity > 1 ? "bold" : "normal" }}>
                      {capitalize(prod.name)}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      {quantity > 1 ? `${quantity}x` : "1x"}
                    </Typography>
                  </Box>
                );
              })}
              {products.length > 1 && (
                <Box
                  sx={{ fontSize: "0.75rem", color: "text.secondary", textAlign: "right", pt: 0.5 }}
                >
                  Total: {products.length} itens
                </Box>
              )}
            </Stack>
          )}
        </Box>

        <Divider />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text variant="subtitle2">Total: R$ {totalPrice}</Text>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Editar">
              <IconButton onClick={onEdit} size="small">
                <EditIcon sx={{ color: "#666666" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton onClick={onDelete} size="small">
                <DeleteIcon sx={{ color: "#9B0B00" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CardOrdersMobile;
