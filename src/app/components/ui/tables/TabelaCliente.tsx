'use client';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import { capitalize, capitalizeFirstLastName } from '@/utils';
import { Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { Filtros } from '../..';
import { GridColDef } from '@mui/x-data-grid';
import { Tabela } from './Tabela';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface TabelaProps {
  data: any;
  isLoading: boolean;
}

const BACKGROUND_STATUS_COLORS: Record<string, string> = {
  inativo: '#FFF3E0',
  ativo: '#E8F5E9',
};

const STATUS_COLORS: Record<string, string> = {
  inativo: '#FF9800',
  ativo: '#4CAF50',
};

export const TabelaCliente = ({ data, isLoading }: TabelaProps) => {
  const router = useRouter();

  const handleBackgroundColorStatus = (status: string) => {
    return BACKGROUND_STATUS_COLORS[status] || BACKGROUND_STATUS_COLORS.default;
  };

  const handleColorStatus = (status: string) => {
    return STATUS_COLORS[status] || STATUS_COLORS.default;
  };

  const getStatusIcon = (status: string): React.ReactElement | undefined => {
    switch (status) {
      case 'ativo':
        return <HowToRegOutlinedIcon color="success" />;
      case 'inativo':
        return <PersonOffOutlinedIcon color="warning" />;
    }
  };

  const columns = useMemo<GridColDef<any>[]>(
    () => [
      {
        field: 'nomeCompleto',
        headerName: 'Nome',
        disableColumnMenu: true,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {capitalizeFirstLastName(params.value)}
          </Typography>
        ),
      },
      {
        field: 'telefone',
        headerName: 'Telefone',
        disableColumnMenu: true,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'email',
        headerName: 'Email',
        disableColumnMenu: true,
        miWidth: 800,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'grupoFamiliar',
        headerName: 'Grupo familiar',
        disableColumnMenu: true,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'acoes',
        headerName: '',
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        renderCell: () => (
          <ModeEditOutlineOutlinedIcon sx={{ color: 'primary.main' }} />
        ),
      },
    ],
    []
  );

  // const handleClickCell = (params: ConcursoRow) => {
  //   const { ID_CONCURSO } = params;
  //   const id = ID_CONCURSO;
  //   router.replace(`/painel/gerencial/concurso/visualizar/${id}`);
  // };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 0 }}>
      <Typography variant="h5">Clientes cadastrados</Typography>
      <Filtros rows={data}>
        {(rowsFiltradas) =>
          isLoading ? (
            <CircularProgress />
          ) : (
            <Tabela
              columns={columns}
              rows={rowsFiltradas}
              getRowId={(row) => row.id}
              onCellClick={(params) => console.log(params.row)}
              getRowHeight={() => 'auto'}
              sx={{
                border: 'none',
                '& .MuiDataGrid-row': {
                  minHeight: '64px !important',
                  maxHeight: 'none !important',
                },
                '& .MuiDataGrid-cell': {
                  cursor: 'pointer !important',
                },
              }}
            />
          )
        }
      </Filtros>
    </Paper>
  );
};
