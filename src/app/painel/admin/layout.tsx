import { NewSidebar } from '@/app/components';
import Header from '@/app/components/ui/header/Header';
import Sidebar from '@/app/components/ui/sidebar/Sidebar';
import { Box, Stack } from '@mui/material';

const drawerWidth = 260; // Largura do Sidebar (precisa ser a mesma)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Stack direction="row" sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar fixa */}
      {/* <Sidebar /> */}
      <NewSidebar />

      {/* Conteúdo principal */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header fixo */}
        <Header />

        {/* Container para o conteúdo com rolagem */}
        <Box
          sx={{
            margin: '4rem 1rem 0 0',
            padding: '2rem',
            height: '100%', // Mantém o conteúdo em toda a altura disponível
            overflowY: 'auto', // Habilita a rolagem apenas aqui
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            backgroundColor: '#eef2f6',
            flexGrow: 1, // Garante que o Box ocupe o espaço restante
          }}
        >
          {children}
        </Box>
      </Box>
    </Stack>
  );
}
