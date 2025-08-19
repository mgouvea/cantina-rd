import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme, useMediaQuery } from "@mui/material";

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

export default function SimpleLineChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <LineChart
      height={isMobile ? 250 : 300}
      series={[
        { data: pData, label: "Receitas" },
        { data: uData, label: "Despesas" },
      ]}
      colors={["#16a34a", "#e22626"]}
      xAxis={[{ 
        scaleType: "point", 
        data: xLabels,
        tickLabelStyle: isMobile ? { fontSize: 10 } : undefined
      }]}
      yAxis={[{ 
        width: isMobile ? 40 : 50,
        tickLabelStyle: isMobile ? { fontSize: 10 } : undefined
      }]}
      margin={margin}
      sx={{
        '& .MuiChartsLegend-label': {
          fontSize: isMobile ? 10 : undefined,
        },
        '& .MuiChartsLegend-mark': {
          width: isMobile ? 8 : undefined,
          height: isMobile ? 8 : undefined,
          marginRight: isMobile ? 3 : undefined
        }
      }}
    />
  );
}
