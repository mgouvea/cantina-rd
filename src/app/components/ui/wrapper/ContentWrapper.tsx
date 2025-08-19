import { Stack, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import GenericBreadcrumbs from "../../breadcrumb/GenericBreadcrumb";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface WrapperProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  breadcrumbItems: BreadcrumbItem[];
  isDashboard?: boolean;
}

const ContentWrapper = ({
  children,
  minWidth = 800,
  maxWidth = 1400,
  minHeight = 500,
  breadcrumbItems,
  isDashboard = false,
}: WrapperProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack
        sx={{
          minWidth: isMobile ? "100%" : minWidth,
          maxWidth: isMobile ? "100%" : maxWidth,
          minHeight: minHeight,
          backgroundColor: isDashboard ? "#eef2f6" : "#fff",
          borderRadius: "16px",
          mt: "0.3rem",
          overflowX: isMobile ? "hidden" : "auto",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};

export default ContentWrapper;
