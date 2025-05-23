"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Image from "next/image";
import Loading from "@/app/components/loading/Loading";
import Text from "@/app/components/ui/text/Text";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useCurrentQRCode } from "@/hooks/queries/useWhatssApp.query";
import { useEffect, useState } from "react";
import { useGenerateNewQRCode } from "@/hooks/mutations/useWhatsApp.mutation";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "WhatsApp" },
];

interface QrCodeProps {
  isConnected: boolean;
  qrCode: unknown;
  qrCodeBase64: string;
}

export default function WhatsApp() {
  const theme = useTheme();
  const { mutateAsync: generateNewQRCode } = useGenerateNewQRCode();
  const { data: currentQRCode, isLoading: isLoadingCurrent } =
    useCurrentQRCode();

  const [qrCode, setQrCode] = useState<QrCodeProps | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLoadingTimer, setShowLoadingTimer] = useState(false);

  // Set the QR code from the query when it loads
  useEffect(() => {
    if (currentQRCode && !qrCode && !isGenerating) {
      setQrCode(currentQRCode);
    }
  }, [currentQRCode, qrCode, isGenerating]);

  const handleGenerateNewQRCode = async () => {
    try {
      setIsGenerating(true);
      setShowLoadingTimer(true);

      // Generate new QR code
      const newQRCode = await generateNewQRCode();

      // Ensure loading shows for at least 3 seconds
      setTimeout(() => {
        setQrCode(newQRCode);
        setShowLoadingTimer(false);
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      console.error("Error generating new QR code:", error);
      setShowLoadingTimer(false);
      setIsGenerating(false);
    }
  };

  const renderQRCode = () => {
    if (isLoadingCurrent || isGenerating || showLoadingTimer) {
      return <Loading />;
    }

    if (!qrCode) {
      return (
        <Box
          textAlign="center"
          p={3}
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography variant="body1" color="text.secondary">
            Não foi possível carregar o código QR.
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Tente gerar um novo código QR.
          </Typography>
        </Box>
      );
    }

    return (
      <Box pr={10} py={2}>
        <Image
          src={qrCode?.qrCodeBase64}
          alt="WhatsApp QR Code"
          width={350}
          height={350}
          style={{
            boxShadow: theme.shadows[3],
            borderRadius: theme.shape.borderRadius,
          }}
        />
        <Text variant="body1" color="textSecondary" mt={1} maxWidth={350}>
          Escaneie o código QR com seu WhatsApp para conectar sua conta.
        </Text>
      </Box>
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          overflow: "hidden",
          minHeight: "400px",
        }}
      >
        <Stack direction="row" justifyContent="space-between" px={10} py={2}>
          <Box sx={{ pt: 2 }}>
            <Text variant="h5" fontWeight="bold" mb={2} color="success">
              Veja seu QR Code atual
            </Text>

            <Text variant="body1" color="text.secondary" mb={4}>
              {qrCode?.isConnected ? (
                <>
                  <Text variant="body1" color="success">
                    Conectado
                  </Text>
                </>
              ) : (
                <Text variant="body1" color="error">
                  Desconectado
                </Text>
              )}
            </Text>

            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleGenerateNewQRCode}
              disabled={isGenerating || showLoadingTimer}
              sx={{
                mt: "auto",
                alignSelf: "flex-start",
                textTransform: "none",
                fontWeight: "bold",
                mb: { xs: 3, md: 0 },
              }}
            >
              Gerar novo QR Code
            </Button>
          </Box>

          {renderQRCode()}
        </Stack>
      </Box>
    </ContentWrapper>
  );
}
