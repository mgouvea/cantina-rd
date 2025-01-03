import GenericBreadcrumbs from '@/app/components/breadcrumb/GenericBreadcrumb';
import Text from '@/app/components/ui/text/Text';
import { Box, Stack } from '@mui/material';

const breadcrumbItems = [
  { label: 'Início', href: '/painel' },
  { label: 'Faturas' },
];

export default function Faturas() {
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
        <Text>Faturas</Text>
      </Stack>
    </Stack>
  );
}
