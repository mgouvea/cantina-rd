"use client";
import { Box, Stack } from "@mui/material";
import Image from "next/image";
import Text from "../components/ui/text/Text";

export default function FaturaClienteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Stack
      direction="column"
      sx={{ height: "100vh", overflow: "hidden", backgroundColor: "#bebebe" }}
    >
      <Box
        sx={{
          height: "96px",
          backgroundColor: "#fff",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 5,
        }}
      >
        <Image
          src="/cantinaRD.svg"
          alt="Cantina RD"
          width={96}
          height={96}
          style={{
            objectFit: "contain",
          }}
        />
        <Text variant="h5" sx={{ fontWeight: "bold" }}>
          Fatura
        </Text>
      </Box>

      <Box
        sx={{
          margin: "2rem",
          padding: "2rem",
          height: "100%",
          overflowY: "auto",
          borderRadius: "2rem",
          backgroundColor: "#fffeaf",
          flexGrow: 1,
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
