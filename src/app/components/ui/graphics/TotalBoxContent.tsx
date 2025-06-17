import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import Text from "@/app/components/ui/text/Text";
import { Box } from "@mui/material";

const COLORS = [
  { color: "#487fff", backgroundColor: "#bfdcff" },
  { color: "#16a34a", backgroundColor: "#bbf7d0" },
  { color: "#ff9f29", backgroundColor: "#ffeccc" },
  { color: "#FFFF00", backgroundColor: "#ffeccc" },
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
      gap: 2,
      width: "19.37rem",
      height: "8.12rem",
      background: backgroundColor
        ? `linear-gradient(to right, ${color}20, ${backgroundColor}50)`
        : `linear-gradient(to right, ${color}20, #eef2f6)`,
      margin: "1rem",
      padding: "1.5rem 1rem",
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
      width: "44px",
      height: "44px",
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
        alignItems: "center",
        gap: 2,
        height: "11rem",
        backgroundColor: "#fff",
        margin: "1rem",
        borderRadius: "8px",
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

      {/* <BoxContent
        color={COLORS[3].color}
        backgroundColor={COLORS[3].backgroundColor}
      >
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Devoluções
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold">
            R$ 0,00
          </Text>
        </Box>

        <BoxIcon
          color={COLORS[3].color}
          backgroundColor={COLORS[3].backgroundColor}
        >
          <ShoppingCartIcon color="inherit" fontSize="large" />
        </BoxIcon>
      </BoxContent> */}
    </Box>
  );
};
