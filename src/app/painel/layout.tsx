import { NewSidebar } from '@/app/components';
import Header from '@/app/components/ui/header/Header';
import { Box, Stack } from '@mui/material';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Stack direction="row" sx={{ height: '100vh', overflow: 'hidden' }}>
      <NewSidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <Box
          sx={{
            margin: '4rem 1rem 0 0',
            padding: '2rem',
            height: '100%', 
            overflowY: 'auto', 
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            backgroundColor: '#eef2f6',
            flexGrow: 1, 
          }}
        >
          {children}
        </Box>
      </Box>
    </Stack>
  );
}
