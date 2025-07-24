"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Image from "next/image";
import Loading from "@/app/components/loading/Loading";
import Text from "@/app/components/ui/text/Text";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useCheckConnection, useQRCode } from "@/hooks/queries";
import { useCreateInstance, useRestartInstance } from "@/hooks/mutations";
import { CreateInstance } from "@/types";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "WhatsApp" },
];

export default function WhatsApp() {
  const theme = useTheme();

  const [instance, setInstance] = useState<CreateInstance | null>(null);
  const [isLoadingCreateInstance, setIsLoadingCreateInstance] = useState(false);

  const { data: checkConnection, isLoading: isLoadingCheckConnection } =
    useCheckConnection();
  const { data: qrCode } = useQRCode();

  const { mutateAsync: createInstance } = useCreateInstance();
  const { mutateAsync: restartInstance } = useRestartInstance();

  const handleCreateInstance = async () => {
    setIsLoadingCreateInstance(true);
    if (checkConnection?.status === "CONNECTED") {
      const restart = await restartInstance();
      setInstance(restart);
    } else {
      const create = await createInstance();
      setInstance(create);
    }
    setIsLoadingCreateInstance(false);
  };

  console.log("qrCode", qrCode);

  const renderQRCode = () => {
    if (isLoadingCheckConnection || isLoadingCreateInstance) {
      return <Loading />;
    }

    if (!instance?.qrcode && !qrCode) {
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
          src={qrCode?.base64 || instance?.qrcode.base64}
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
              Use o QR Code para conectar sua conta
            </Text>

            {isLoadingCheckConnection && (
              <Box sx={{ display: "flex", justifyContent: "start", mb: 3 }}>
                <Loading minHeight={5} />
              </Box>
            )}

            {!isLoadingCheckConnection && (
              <Stack direction="row" gap={1} mb={3}>
                <Text variant="subtitle2" color="text.secondary">
                  Status atual:
                </Text>
                {checkConnection?.status === "CONNECTED" ? (
                  <Text variant="subtitle2" color="success" fontWeight="bold">
                    Conectado
                  </Text>
                ) : (
                  <Text variant="subtitle2" color="error" fontWeight="bold">
                    Desconectado
                  </Text>
                )}
              </Stack>
            )}

            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleCreateInstance}
              sx={{
                mt: "auto",
                alignSelf: "flex-start",
                textTransform: "none",
                fontWeight: "bold",
                mb: { xs: 3, md: 0 },
              }}
            >
              {checkConnection?.status === "CONNECTED"
                ? "Reiniciar instância"
                : "Criar nova instância"}
            </Button>
          </Box>

          {renderQRCode()}
        </Stack>
      </Box>
    </ContentWrapper>
  );
}
