'use client';
import { Box, CircularProgress, Stack } from '@mui/material';
import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import { useClient } from '@/hooks/queries';
import Text from '@/app/components/ui/text/Text';

const breadcrumbItems = [
  { label: 'Início', href: '/painel/admin' },
  { label: 'Cliente', href: '/painel/admin/clientes' },
  { label: 'Novo' },
];

export default function NovoGestor() {
  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />
      <Text variant="h5" color="text.primary">
        Cadastrar novo cliente
      </Text>

      <Stack
        sx={{
          width: '100%',
          minHeight: '500px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          mt: '0.3rem',
        }}
      ></Stack>
    </Stack>
  );
}
