'use client';

import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import React from 'react';

interface TabelaProps extends DataGridProps {
  autoHeight?: boolean;
  disableColumnMenu?: boolean;
  disableColumnSelector?: boolean;
  disableRowSelectionOnClick?: boolean;
  hideFooter?: boolean;
  scroll?: boolean;
}

export function Tabela({
  autoHeight,
  disableColumnMenu,
  disableColumnSelector,
  disableRowSelectionOnClick,
  hideFooter,
  scroll,
  ...props
}: Readonly<TabelaProps>) {
  return (
    <DataGrid
      autoHeight={autoHeight}
      disableColumnMenu={disableColumnMenu}
      disableColumnSelector={disableColumnSelector}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      hideFooter={hideFooter}
      sx={{
        '.MuiDataGrid-root': {
          overflowX: scroll ? 'auto' : 'hidden',
        },
        '.MuiDataGrid-virtualScroller': {
          overflowX: scroll ? 'auto' : 'hidden',
        },
        '.MuiDataGrid-cell': {
          border: 'none !important',
        },
        '.MuiDataGrid-withBorderColor': {
          border: 'none !important',
        },
        '.MuiDataGrid-columnHeaders': {
          backgroundColor: 'none !important',
          overflowX: 'hidden',
        },
        '.MuiDataGrid-topContainer': {
          '&::after': {
            backgroundColor: 'transparent !important',
          },
        },
        '.MuiDataGrid-columnHeaders > div': {
          borderRadius: '10px !important',
          color: '#999 !important',
        },
        '.MuiDataGrid-row': {
          cursor: 'pointer',
          borderBottom: '1px solid #ccc',
        },
        '.MuiDataGrid-row:hover': {
          backgroundColor: '#edf4fc !important',
          borderRadius: '10px !important',
          boxShadow: '0px -1px 0px 0px #0000001F inset',
        },
        '&': {
          border: 'none !important',
          fontFamily: 'Roboto, sans-serif',
        },
        '.MuiDataGrid-columnSeparator': {
          display: 'none !important',
        },
        '.MuiDataGrid-sortIcon': {
          color: '#fff !important',
        },
        '.MuiDataGrid-columnHeaderTitleContainerContent > span > svg': {
          fill: '#fff',
        },
        '.Mui-checked > svg': {
          color: '#5271ff',
        },
        '.MuiDataGrid-virtualScrollerContent': {
          borderBottom: '1px solid #0000001F',
        },
        '.MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '.MuiDataGrid-cell:focus-within': {
          outline: 'none',
        },
      }}
      {...props}
      columns={props.columns.map((column) => ({
        ...column,
        minWidth: 150,
        flex: 1,
      }))}
    />
  );
}
