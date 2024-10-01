'use client';

import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <Box onClick={() => router.replace('painel/admin')}>
      <Typography>Acessar area Admin</Typography>
    </Box>
  );
}
