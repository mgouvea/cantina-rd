import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import React from 'react';
import { Box } from '@mui/material';

interface TabelaProps extends DataGridProps {
  autoHeight?: boolean;
  disableColumnMenu?: boolean;
  disableColumnSelector?: boolean;
  disableRowSelectionOnClick?: boolean;
  hideFooter?: boolean;
  scroll?: boolean;
}

export function Tabela({
  autoHeight = true,
  disableColumnMenu = true,
  disableColumnSelector = true,
  disableRowSelectionOnClick = true,
  hideFooter = false,
  scroll = true,
  ...props
}: Readonly<TabelaProps>) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        overflow: 'hidden',
        '@media (max-width: 600px)': {
          '& .MuiDataGrid-root': {
            fontSize: '0.8rem', // Ajuste para telas pequenas
          },
          '& .MuiDataGrid-columnHeaders': {
            display: 'none', // Opcional: Esconde cabeçalhos em telas muito pequenas
          },
          '& .MuiDataGrid-cell': {
            padding: '4px', // Reduz o padding
          },
        },
      }}
    >
      <DataGrid
        autoHeight={autoHeight}
        disableColumnMenu={disableColumnMenu}
        disableColumnSelector={disableColumnSelector}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        hideFooter={hideFooter}
        sx={{
          width: '100%',
          maxWidth: '100%',
          '& .MuiDataGrid-root': {
            overflowX: scroll ? 'auto' : 'hidden',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ccc',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #eee',
          },
          '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
            minWidth: 100, // Reduz o mínimo para telas menores
            flex: 1, // Permite flexibilidade no redimensionamento
          },
        }}
        {...props}
      />
    </Box>
  );
}
