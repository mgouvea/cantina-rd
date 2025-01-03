'use client';
import { Box, CircularProgress, Stack } from '@mui/material';
import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import { IlustracaoIsEmpty } from '@/app/components';
import Text from '@/app/components/ui/text/Text';
import TabelaGestor from '@/app/components/ui/tables/TabelaGestor';
import { useAdmins } from '@/hooks/queries';

const breadcrumbItems = [
  { label: 'Início', href: '/painel/admin' },
  { label: 'Gestores' },
];

export default function Gestor() {
  const { data: dadosGestor, isLoading } = useAdmins();

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
        ) : !dadosGestor ? (
          renderClienteEmpty()
        ) : (
          <>
            <TabelaGestor data={dadosGestor} isLoading={isLoading} />
          </>
        )}
      </Stack>
    </Stack>
  );
}
