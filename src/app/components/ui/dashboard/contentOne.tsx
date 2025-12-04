import { Box } from "@mui/material";
import { OpenInvoiceTime, PaymentsVsReceives } from "@/types";
import Text from "../text/Text";
import Loading from "../../loading/Loading";
import AreaChart from "../graphics/AreaChart";
import BarsChart from "../graphics/BarsChart";

interface ContentOneProps {
  isLoadingPaymentsVsReceives: boolean;
  paymentsVsReceives: PaymentsVsReceives | null;
  isMobile: boolean;
  isLoadingOpenInvoiceTime: boolean;
  openInvoiceTime: OpenInvoiceTime | null;
}

const CHART_HEIGHTS = {
  mobile: "350px",
  desktop: "inherit",
} as const;

const ContentOne = ({
  isLoadingPaymentsVsReceives,
  paymentsVsReceives,
  isMobile,
  isLoadingOpenInvoiceTime,
  openInvoiceTime,
}: ContentOneProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 1.5, md: 3 },
        height: { xs: "auto", md: "24rem" },
        marginInline: isMobile ? "0" : { xs: "0.25rem", sm: "0.5rem" },
      }}
    >
      {/* Receitas vs Despesas */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: { xs: "0.75rem", sm: "1rem" },
          gap: { xs: 0.5, sm: 1 },
          width: { xs: "100%", md: "70%" },
          height: { xs: CHART_HEIGHTS.mobile, md: CHART_HEIGHTS.desktop },
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <Text variant="subtitle2" color="#596772" fontWeight="bold">
          Receitas vs Despesas
        </Text>
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            height: "calc(100% - 24px)",
          }}
        >
          {isLoadingPaymentsVsReceives || !paymentsVsReceives ? (
            <Loading minHeight={10} />
          ) : (
            <AreaChart data={paymentsVsReceives} />
          )}
        </Box>
      </Box>

      {/* Saldo em Aberto ao Longo do Tempo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: { xs: "0.75rem", sm: "1rem" },
          gap: { xs: 0.5, sm: 1 },
          width: { xs: "100%", md: "70%" },
          height: { xs: CHART_HEIGHTS.mobile, md: CHART_HEIGHTS.desktop },
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <Text variant="subtitle2" color="#596772" fontWeight="bold">
          Evolução do saldo em aberto ao longo do tempo
        </Text>
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            height: "calc(100% - 24px)",
          }}
        >
          {isLoadingOpenInvoiceTime || !openInvoiceTime ? (
            <Loading minHeight={10} />
          ) : (
            <BarsChart data={openInvoiceTime} label="Saldo em aberto" color="#e22626" />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ContentOne;
