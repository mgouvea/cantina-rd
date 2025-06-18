import { Avatar, Box } from "@mui/material";
import React from "react";
import Text from "../text/Text";

export const TopClients = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: "0.5rem",
        marginY: "0.5rem",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar src="" alt="" sx={{ width: 36, height: 36 }} />

        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Nome Cliente
          </Text>
          <Text variant="caption" color="#596772">
            Grupo familiar
          </Text>
        </Box>
      </Box>

      <Text variant="subtitle1" color="success.main" fontWeight="bold">
        R$ 5
      </Text>
    </Box>
  );
};
