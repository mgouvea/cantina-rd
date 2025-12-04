import { BarChart } from "@mui/x-charts";
import { useTheme, useMediaQuery } from "@mui/material";
import { OpenInvoiceTime } from "@/types";

// Formato customizado (mantido para compatibilidade)
interface BarsChartData {
  months: string[]; // Labels dos meses (ex: ["Jan", "Fev", "Mar", ...])
  values: number[]; // Valores correspondentes a cada mês
  label?: string; // Label opcional para a série
  color?: string; // Cor opcional para as barras
}

// Aceita tanto o formato customizado quanto o formato do endpoint
type ChartData = BarsChartData | OpenInvoiceTime;

interface BarsChartProps {
  data: ChartData;
  height?: number;
  label?: string;
  color?: string;
}

const BarsChart = ({ data, height = 300, label, color }: BarsChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Detectar qual formato de dados está sendo usado
  const isOpenInvoiceTime = "openBalance" in data;

  const xAxisData = isOpenInvoiceTime ? data.xLabels : (data as BarsChartData).months;
  const seriesData = isOpenInvoiceTime ? data.openBalance : (data as BarsChartData).values;
  const seriesLabel = label || (data as BarsChartData).label || "Valores";
  const seriesColor = color || (data as BarsChartData).color || theme.palette.primary.main;

  return (
    <BarChart
      xAxis={[
        {
          data: xAxisData,
          scaleType: "band",
          tickLabelStyle: isMobile ? { fontSize: 10 } : undefined,
          categoryGapRatio: 0.5, // Aumenta o espaço entre as categorias
          barGapRatio: 0.3, // Reduz o espaço entre barras do mesmo grupo
        },
      ]}
      series={[
        {
          data: seriesData,
          label: seriesLabel,
          color: seriesColor,
        },
      ]}
      height={isMobile ? 250 : height}
      margin={{ left: isMobile ? 40 : 50, right: 24, top: 40, bottom: 40 }}
      yAxis={[
        {
          tickLabelStyle: isMobile ? { fontSize: 10 } : undefined,
        },
      ]}
      sx={{
        "& .MuiChartsLegend-label": {
          fontSize: isMobile ? 10 : undefined,
        },
      }}
    />
  );
};

export default BarsChart;
