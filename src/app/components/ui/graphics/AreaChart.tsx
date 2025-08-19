import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme, useMediaQuery } from "@mui/material";
import { PaymentsVsReceives } from "@/types";

const margin = { right: 24 };

export default function AreaChart({ data }: { data: PaymentsVsReceives }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <LineChart
      height={isMobile ? 250 : 300}
      series={[
        { data: data.payments, label: "Receitas" },
        { data: data.expenses, label: "Despesas" },
      ]}
      colors={["#16a34a", "#e22626"]}
      xAxis={[
        {
          scaleType: "point",
          data: data.xLabels,
          tickLabelStyle: isMobile ? { fontSize: 10 } : undefined,
        },
      ]}
      yAxis={[
        {
          width: isMobile ? 40 : 50,
          tickLabelStyle: isMobile ? { fontSize: 10 } : undefined,
        },
      ]}
      margin={margin}
      sx={{
        "& .MuiChartsLegend-label": {
          fontSize: isMobile ? 10 : undefined,
        },
        "& .MuiChartsLegend-mark": {
          width: isMobile ? 8 : undefined,
          height: isMobile ? 8 : undefined,
          marginRight: isMobile ? 3 : undefined,
        },
      }}
    />
  );
}
