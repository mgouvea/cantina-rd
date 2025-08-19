import React from "react";
import Text from "../text/Text";
import { Avatar, Box, useTheme, useMediaQuery } from "@mui/material";
import { capitalizeFirstLastName } from "@/utils";

interface FamiliesOpenProps {
  name: string;
  ownerName: string;
  ownerAvatar: string;
  value: number;
}

export const FamiliesOpen = ({
  name,
  ownerName,
  ownerAvatar,
  value,
}: FamiliesOpenProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: "0.5rem",
        marginY: { xs: "0.3rem", sm: "0.5rem" },
        gap: { xs: 0.3, sm: 0.5 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar 
          src={ownerAvatar} 
          alt="" 
          sx={{ 
            width: isMobile ? 30 : 36, 
            height: isMobile ? 30 : 36 
          }} 
        />

        <Box>
          <Text 
            variant="subtitle2" 
            color="#596772" 
            fontWeight="bold"
            sx={{ fontSize: isMobile ? '0.8rem' : undefined }}
          >
            {name}
          </Text>
          <Text 
            variant="caption" 
            color="#596772"
            sx={{ fontSize: isMobile ? '0.7rem' : undefined }}
          >
            {capitalizeFirstLastName(ownerName)}
          </Text>
        </Box>
      </Box>

      <Text 
        variant="subtitle1" 
        color="error.main" 
        fontWeight="bold"
        sx={{ fontSize: isMobile ? '0.85rem' : undefined }}
      >
        R$ {value.toFixed(2)}
      </Text>
    </Box>
  );
};
