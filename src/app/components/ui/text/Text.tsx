import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface TextComponentProps extends TypographyProps {
  variant?: TypographyProps['variant'];
  color?: TypographyProps['color'];
}

const Text: React.FC<TextComponentProps> = ({
  variant = 'body1',
  color = 'textPrimary',
  children,
  ...props
}) => {
  return (
    <Typography variant={variant} color={color} {...props}>
      {children}
    </Typography>
  );
};

export default Text;
