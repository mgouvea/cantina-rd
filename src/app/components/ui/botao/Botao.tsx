import React from "react";
import { Button, ButtonProps } from "@mui/material";

export const Botao: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      sx={{
        ...(props.variant == "outlined" && {
          border: "1px solid #999999",
          color: "#333333",
          "&:hover": {
            backgroundColor: `${props.color}.main`,
            borderColor: `${props.color}.main`,
            color: "white",
          },
        }),
        borderRadius: 9,
        boxShadow: "none",
        textTransform: "none",
        "&:hover": {
          boxShadow: "none",
        },
        ...props.sx,
      }}
    />
  );
};
