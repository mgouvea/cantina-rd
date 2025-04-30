"use client";

import { SnackbarProvider } from "@/app/components";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  const queryClient = new QueryClient();
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1565c0",
        light: "#5E95D2",
        dark: "#073C78",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FFC808",
        light: "#FFDD66",
        dark: "#B88F00",
        contrastText: "#ffffff",
      },
      error: {
        main: "#E45A67",
        light: "#F88590",
        dark: "#A41A27",
        contrastText: "#ffffff",
      },
      warning: {
        main: "#FF5E08",
        light: "#FF9B66",
        dark: "#B84000",
        contrastText: "#000000",
      },
      info: {
        main: "#2196f3",
        light: "#64b5f6",
        dark: "#1976d2",
        contrastText: "#ffffff",
      },
      success: {
        main: "#4caf50",
        light: "#81c784",
        dark: "#388e3c",
        contrastText: "#ffffff",
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
      text: {
        primary: "#333333",
        secondary: "#666666",
        disabled: "#e0e0e0",
      },
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: "inherit", // Herda a cor automaticamente do tema
            textDecoration: "none",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "text.primary", // Use a cor primária do texto
          },
        },
      },
    },
  });

  return (
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  );
};
