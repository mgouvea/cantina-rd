import { Avatar, Box, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import Text from "../text/Text";
import { MostSoldProducts } from "@/types";

export const TopProducts = ({
  name,
  price,
  totalQuantity,
  urlImage,
}: MostSoldProducts) => {
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
          src={urlImage} 
          alt={name} 
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
            R$ {price}
          </Text>
        </Box>
      </Box>

      <Text 
        variant="subtitle1" 
        color="success.main" 
        fontWeight="bold"
        sx={{ fontSize: isMobile ? '0.85rem' : undefined }}
      >
        {totalQuantity}
      </Text>
    </Box>
  );
};
