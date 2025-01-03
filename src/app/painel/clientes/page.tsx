'use client';

import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import TabelaCliente from '@/app/components/ui/tables/TabelaCliente';
import Text from '@/app/components/ui/text/Text';
import { Box, CircularProgress, Stack } from '@mui/material';
import { IlustracaoIsEmpty } from '@/app/components';
import { useApp } from '@/contexts';
import { useEffect } from 'react';
import { useUsers } from '@/hooks/queries';

const breadcrumbItems = [
  { label: 'Início', href: '/painel' },
  { label: 'Clientes' },
];

export default function Clientes() {
  const { data, isLoading } = useUsers();
  const { setUserContext } = useApp();

  useEffect(() => {
    if (!isLoading && data) {
      setUserContext(data);
    }
  }, [data]);

  const renderClienteEmpty = () => {
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
          Ainda não há clientes para exibir{' '}
        </Text>
      </Box>
    );
  };

  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack
        sx={{
          minWidth: '800px',
          maxWidth: '1400px',
          minHeight: '500px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          mt: '0.3rem',
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '500px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : !data ? (
          renderClienteEmpty()
        ) : (
          <>
            <TabelaCliente data={data} isLoading={isLoading} />
          </>
        )}
      </Stack>
    </Stack>
  );
}
