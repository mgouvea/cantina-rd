"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export const PieChartProduct = () => {
  const [series] = useState([44, 55, 13, 43, 22]);

  const [options] = useState<ApexOptions>({
    chart: {
      type: "pie",
      toolbar: {
        show: false,
      },
      height: "100%",
      width: "100%",
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    colors: ["#487fff", "#ff9f29", "#4caf50", "#f44336", "#9c27b0"],
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      markers: {
        strokeWidth: 0,
        offsetX: -3,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
        fontWeight: "normal",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        width="100%"
        height="100%"
      />
    </Box>
  );
};
