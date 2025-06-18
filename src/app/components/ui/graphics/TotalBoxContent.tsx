import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import Text from "@/app/components/ui/text/Text";
import { Box, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const COLORS = [
  { color: "#487fff", backgroundColor: "#bfdcff" },
  { color: "#16a34a", backgroundColor: "#bbf7d0" },
  { color: "#ff9f29", backgroundColor: "#ffeccc" },
  { color: "#e22626", backgroundColor: "#fee2e2" },
];

const BoxContent = ({
  children,
  color,
  backgroundColor,
}: {
  children: React.ReactNode;
  color: string;
  backgroundColor?: string;
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      gap: 1.5,
      width: { xs: "90%", sm: "80%", md: "17rem" },
      height: { xs: "auto", md: "7rem" },
      minHeight: "6rem",
      background: backgroundColor
        ? `linear-gradient(to right, ${color}20, ${backgroundColor}50)`
        : `linear-gradient(to right, ${color}20, #eef2f6)`,
      margin: { xs: "0.5rem", md: "0.5rem" },
      padding: "1rem 0.8rem",
      borderRadius: "8px",
      borderLeft: `3px solid ${color}`,
    }}
  >
    {children}
  </Box>
);

const BoxIcon = ({
  children,
  color,
  backgroundColor,
}: {
  children: React.ReactNode;
  color: string;
  backgroundColor: string;
}) => (
  <Box
    sx={{
      backgroundColor: backgroundColor,
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: color,
    }}
  >
    {children}
  </Box>
);

export const TotalBoxContent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: "center",
        gap: 1.5,
        height: { xs: "auto", lg: "9rem" },
        backgroundColor: "#fff",
        margin: "1rem",
        borderRadius: "8px",
        padding: { xs: "0.5rem 0", lg: 0 },
      }}
    >
      <BoxContent
        color={COLORS[0].color}
        backgroundColor={COLORS[0].backgroundColor}
      >
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Total de vendas
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold">
            R$ 0,00
          </Text>
        </Box>

        <BoxIcon
          color={COLORS[0].color}
          backgroundColor={COLORS[0].backgroundColor}
        >
          <ShoppingCartIcon color="inherit" fontSize="large" />
        </BoxIcon>
      </BoxContent>
      <BoxContent
        color={COLORS[1].color}
        backgroundColor={COLORS[1].backgroundColor}
      >
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Pagamentos Recebidos
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold">
            R$ 0,00
          </Text>
        </Box>

        <BoxIcon
          color={COLORS[1].color}
          backgroundColor={COLORS[1].backgroundColor}
        >
          <PriceCheckIcon color="inherit" fontSize="large" />
        </BoxIcon>
      </BoxContent>
      <BoxContent
        color={COLORS[2].color}
        backgroundColor={COLORS[2].backgroundColor}
      >
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Pagamentos Pendentes
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold">
            R$ 0,00
          </Text>
        </Box>

        <BoxIcon
          color={COLORS[2].color}
          backgroundColor={COLORS[2].backgroundColor}
        >
          <AccessTimeFilledIcon color="inherit" fontSize="large" />
        </BoxIcon>
      </BoxContent>

      <BoxContent
        color={COLORS[3].color}
        backgroundColor={COLORS[3].backgroundColor}
      >
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Em aberto
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold">
            R$ 0,00
          </Text>

          <Tooltip title="Valores não consideram os filtros de data">
            <Box
              sx={{
                display: "flex",
                gap: 1,
                cursor: "pointer",
                marginTop: "0.3rem",
              }}
            >
              <InfoOutlinedIcon color="inherit" fontSize="small" />
              <Text variant="caption" mt="0.1rem" color="#596772">
                Total de valores pendentes
              </Text>
            </Box>
          </Tooltip>
        </Box>

        <BoxIcon
          color={COLORS[3].color}
          backgroundColor={COLORS[3].backgroundColor}
        >
          <ProductionQuantityLimitsOutlinedIcon
            color="inherit"
            fontSize="large"
          />
        </BoxIcon>
      </BoxContent>
    </Box>
  );
};
