import React from "react";
import Text from "../text/Text";
import { Avatar, Box } from "@mui/material";
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
        <Avatar src={ownerAvatar} alt="" sx={{ width: 36, height: 36 }} />

        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            {name}
          </Text>
          <Text variant="caption" color="#596772">
            {capitalizeFirstLastName(ownerName)}
          </Text>
        </Box>
      </Box>

      <Text variant="subtitle1" color="error.main" fontWeight="bold">
        R$ {value.toFixed(2)}
      </Text>
    </Box>
  );
};
