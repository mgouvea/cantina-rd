import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

interface TabelaProps extends DataGridProps {
  autoHeight?: boolean;
  disableColumnMenu?: boolean;
  disableColumnSelector?: boolean;
  disableRowSelectionOnClick?: boolean;
  hideFooter?: boolean;
  scroll?: boolean;
}

export function Tabela({
  autoHeight = true,
  disableColumnMenu = true,
  disableColumnSelector = true,
  disableRowSelectionOnClick = true,
  hideFooter = false,
  scroll = true,
  ...props
}: Readonly<TabelaProps>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        overflow: "hidden",
        "@media (max-width: 600px)": {
          "& .MuiDataGrid-root": {
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-cell": {
            padding: "4px",
          },
        },
      }}
    >
      <DataGrid
        autoHeight={autoHeight}
        disableColumnMenu={disableColumnMenu}
        disableColumnSelector={disableColumnSelector}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        hideFooter={hideFooter}
        density={isMobile ? "compact" : "standard"}
        columnVisibilityModel={
          isMobile
            ? {
                // Hide less important columns on mobile
                description: false,
                actions: true,
              }
            : undefined
        }
        sx={{
          width: "100%",
          maxWidth: "100%",
          "& .MuiDataGrid-root": {
            overflowX: scroll ? "auto" : "hidden",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ccc",
            display: "flex",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #eee",
            overflow: "auto",
            whiteSpace: "normal",
            lineHeight: "1.2",
          },
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
            minWidth: isMobile ? 80 : isTablet ? 90 : 100,
            flex: 1,
            padding: isMobile ? "4px 8px" : "16px",
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bdbdbd",
              borderRadius: "4px",
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #ccc",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
        {...props}
      />
    </Box>
  );
}
