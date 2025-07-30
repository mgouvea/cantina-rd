"use client";

import React from "react";
import VisitorPaymentTable from "../tables/VisitorPaymentTable";
import { Box } from "@mui/material";
import { BoxStyle } from "./style/BoxStyle";
import { usePaymentsVisitors } from "@/hooks/queries/usePayments-visitors.query";

export const VisitorPaymentWrapper = () => {
  const { data, isLoading } = usePaymentsVisitors();

  return (
    <Box sx={BoxStyle}>
      <VisitorPaymentTable data={data || []} isLoading={isLoading} />
    </Box>
  );
};
