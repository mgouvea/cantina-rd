import { Box, CircularProgress } from "@mui/material";
import React from "react";

interface LoadingProps {
  minHeight?: number;
}

const Loading = ({ minHeight = 500 }: LoadingProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: minHeight,
        color: "primary",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
