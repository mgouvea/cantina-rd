"use client";

import Header from "@/app/components/ui/header/Header";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Sidebar, SidebarContext } from "../components/ui/sidebar/Sidebar";
import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);
  
  // Fechar o drawer quando mudar de rota em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  }, [pathname, isMobile]);
  
  // Valor do contexto para compartilhar com os componentes filhos
  const sidebarContextValue = {
    isMobile,
    isDrawerOpen,
    toggleDrawer
  };

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <Stack direction="row" sx={{ height: "100vh", overflow: "hidden" }}>
        <Sidebar />

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            width: "100%",
          }}
        >
        <Header />

        <Box
          sx={{
            margin: isMobile ? "4rem 0 0 0" : "4rem 1rem 0 0",
            padding: isMobile ? "1rem" : "2rem",
            height: "100%",
            overflowY: "auto",
            borderTopLeftRadius: isMobile ? "0" : "24px",
            borderTopRightRadius: isMobile ? "0" : "24px",
            backgroundColor: "#eef2f6",
            flexGrow: 1,
            "&::-webkit-scrollbar": {
              height: "6px",
              width: "7px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "success.main",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "success.dark",
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>
      </Stack>
    </SidebarContext.Provider>
  );
}
