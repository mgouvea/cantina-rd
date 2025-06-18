"use client";

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Box } from "@mui/material";

export const AreaChart = () => {
  const [series] = useState([
    {
      name: "Vendas",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "À receber",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ]);

  const [options] = useState<ApexOptions>({
    chart: {
      height: "100%",
      width: "100%",
      type: "area",
      toolbar: {
        show: false,
      },
      parentHeightOffset: 0,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#487fff", "#ff9f29"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#64748B",
      },
    },
  });

  return (
    <Box sx={{ width: "100%", height: "calc(100% - 30px)" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height="100%"
        width="100%"
      />
    </Box>
  );
};
