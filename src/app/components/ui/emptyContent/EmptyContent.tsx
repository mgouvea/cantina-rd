import { Box } from '@mui/material';
import React from 'react';
import { IlustracaoIsEmpty } from '../../svg/IlustracaoEmpty';
import Text from '../text/Text';

interface EmptyProps {
  title: string;
}

const EmptyContent = ({ title }: EmptyProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: ' 24px',
        alignItems: 'center',
      }}
    >
      <IlustracaoIsEmpty />
      <Text
        sx={{
          fontSize: '16px',
          lineHeight: '18.38px',
          letter: '0.5px',
          color: '#333333',
        }}
      >
        {title}
      </Text>
    </Box>
  );
};

export default EmptyContent;
