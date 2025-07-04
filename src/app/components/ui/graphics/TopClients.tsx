import { Avatar, Box } from "@mui/material";
import React from "react";
import Text from "../text/Text";
import { TopClientsDto } from "@/types";
import { capitalizeFirstLastName } from "@/utils";

export const TopClients = ({
  name,
  totalSpent,
  groupFamilyName,
  urlImage,
}: TopClientsDto) => {
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
        <Avatar src={urlImage} alt="" sx={{ width: 36, height: 36 }} />

        <Box>
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            {capitalizeFirstLastName(name)}
          </Text>
          <Text variant="caption" color="#596772">
            {groupFamilyName}
          </Text>
        </Box>
      </Box>

      <Text variant="subtitle1" color="success.main" fontWeight="bold">
        R$ {totalSpent}
      </Text>
    </Box>
  );
};
