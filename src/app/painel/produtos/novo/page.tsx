'use client';

import { Stack } from '@mui/material';
import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import Text from '@/app/components/ui/text/Text';

const breadcrumbItems = [
  { label: 'Início', href: '/painel' },
  { label: 'Produtos', href: '/painel/produtos' },
  { label: 'Novo' },
];

export default function NovoProduto() {
  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />
      <Text variant="h5" color="text.primary">
        Cadastrar novo produto
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
