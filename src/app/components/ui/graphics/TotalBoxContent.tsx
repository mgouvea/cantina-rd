import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import Text from "@/app/components/ui/text/Text";
import { Box, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTotalContents } from "@/hooks/queries/useDashboard.query";
import Loading from "../../loading/Loading";

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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
        width: isMobile ? "calc(100% - 16px)" : "100%",
        height: { xs: "auto", md: "7rem" },
        minHeight: { xs: "5.5rem", md: "6rem" },
        background: backgroundColor
          ? `linear-gradient(to right, ${color}20, ${backgroundColor}50)`
          : `linear-gradient(to right, ${color}20, #eef2f6)`,
        margin: isMobile ? "0.25rem 8px" : "0.5rem",
        padding: isMobile ? "0.75rem 0.6rem" : "1rem 0.8rem",
        borderRadius: "8px",
        borderLeft: `3px solid ${color}`,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

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
      width: { xs: "32px", sm: "36px" },
      height: { xs: "32px", sm: "36px" },
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: color,
      flexShrink: 0,
    }}
  >
    {children}
  </Box>
);

export const TotalBoxContent = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Usar o hook useTotalContents com as datas
  const { data: totalContents, isLoading } = useTotalContents(startDate, endDate);

  // Valores padrão caso os dados ainda não tenham sido carregados
  const totalSales = totalContents?.totalOrders || 0;
  const receivedPayments = totalContents?.totalPayments || 0;
  const pendingPayments = totalContents?.totalOpenInvoices || 0;
  const openAmount = totalContents?.totalOpenInvoicesWithoutDateRange || 0;

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 1.5,
        alignItems: isMobile ? "flex-start" : "center",
        height: { xs: "auto", lg: "9rem" },
        margin: isMobile ? "1rem 0" : "1rem",
        padding: isMobile ? "0.5rem" : "1rem",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <BoxContent color={COLORS[0].color} backgroundColor={COLORS[0].backgroundColor}>
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Total de vendas
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold" mt="0.5rem">
            {isLoading ? <Loading minHeight={20} /> : formatCurrency(totalSales)}
          </Text>
        </Box>

        <BoxIcon color={COLORS[0].color} backgroundColor={COLORS[0].backgroundColor}>
          <ShoppingCartIcon color="inherit" fontSize={isMobile ? "medium" : "large"} />
        </BoxIcon>
      </BoxContent>
      <BoxContent color={COLORS[1].color} backgroundColor={COLORS[1].backgroundColor}>
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Pagamentos Recebidos
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold" mt="0.5rem">
            {isLoading ? <Loading minHeight={20} /> : formatCurrency(receivedPayments)}
          </Text>
        </Box>

        <BoxIcon color={COLORS[1].color} backgroundColor={COLORS[1].backgroundColor}>
          <PriceCheckIcon color="inherit" fontSize={isMobile ? "medium" : "large"} />
        </BoxIcon>
      </BoxContent>
      <BoxContent color={COLORS[2].color} backgroundColor={COLORS[2].backgroundColor}>
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Pagamentos Pendentes
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold" mt="0.5rem">
            {isLoading ? <Loading minHeight={20} /> : formatCurrency(pendingPayments)}
          </Text>
        </Box>

        <BoxIcon color={COLORS[2].color} backgroundColor={COLORS[2].backgroundColor}>
          <AccessTimeFilledIcon color="inherit" fontSize={isMobile ? "medium" : "large"} />
        </BoxIcon>
      </BoxContent>

      <BoxContent color={COLORS[3].color} backgroundColor={COLORS[3].backgroundColor}>
        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Em aberto
          </Text>
          <Text variant="h4" color="#111c35" fontWeight="bold" mt="0.5rem">
            {isLoading ? <Loading minHeight={20} /> : formatCurrency(openAmount)}
          </Text>

          <Tooltip title="Valores não consideram os filtros de data">
            <Box
              sx={{
                display: "flex",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <InfoOutlinedIcon color="inherit" fontSize="small" />
              <Text variant="caption" color="#596772">
                Total de valores pendentes
              </Text>
            </Box>
          </Tooltip>
        </Box>

        <BoxIcon color={COLORS[3].color} backgroundColor={COLORS[3].backgroundColor}>
          <ProductionQuantityLimitsOutlinedIcon
            color="inherit"
            fontSize={isMobile ? "medium" : "large"}
          />
        </BoxIcon>
      </BoxContent>
    </Box>
  );
};
