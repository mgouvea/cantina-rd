'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Pesquisa } from './Pesquisa';

type FiltrosProps = {
  children: (filteredRows: any[]) => React.ReactNode;
  rows: any[];
};

export const Filtros: React.FC<FiltrosProps> = ({ children, rows }) => {
  const [parametrosDeBusca, setParametrosDeBusca] = useState('');

  const filteredRows = rows?.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(parametrosDeBusca.toLowerCase())
    )
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: { xs: 250, sm: 300 },
          }}
        >
          <Pesquisa
            parametrosDeBusca={parametrosDeBusca}
            setParametrosDeBusca={setParametrosDeBusca}
          />
        </Box>
      </Box>
      {children(filteredRows)}
    </>
  );
};
