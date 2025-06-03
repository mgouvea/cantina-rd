import React from "react";
import { Typography, TypographyProps } from "@mui/material";

interface TextComponentProps extends TypographyProps {
  variant?: TypographyProps["variant"];
  color?: TypographyProps["color"];
  margin?: TypographyProps["marginTop"];
}

const Text: React.FC<TextComponentProps> = ({
  variant = "body1",
  color = "textPrimary",
  margin,
  children,
  ...props
}) => {
  return (
    <Typography variant={variant} color={color} marginTop={margin} {...props}>
      {children}
    </Typography>
  );
};

export default Text;
