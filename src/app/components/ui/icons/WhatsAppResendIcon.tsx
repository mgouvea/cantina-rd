"use client";

import { Box, IconButton, keyframes } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface WhatsAppResendIconProps {
  isPending: boolean;
}

export default function WhatsAppResendIcon({
  isPending,
}: WhatsAppResendIconProps) {
  return (
    <IconButton>
      <Box position="relative" display="inline-flex">
        <SendOutlinedIcon fontSize="medium" color="success" />
        <AutorenewIcon
          fontSize="small"
          color="error"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: "white",
            borderRadius: "50%",
            fontSize: "13px",
            animation: isPending ? `${spin} 1.5s linear infinite` : "none",
          }}
        />
      </Box>
    </IconButton>
  );
}
