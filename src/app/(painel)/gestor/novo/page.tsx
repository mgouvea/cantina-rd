"use client";
import { Stack } from "@mui/material";
import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import Text from "@/app/components/ui/text/Text";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Gestores", href: "/gestores" },
  { label: "Novo" },
];

export default function NovoGestor() {
  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />
      <Text variant="h5" color="text.primary">
        Cadastrar novo gestor
      </Text>

      <Stack
        sx={{
          width: "100%",
          minHeight: "500px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          mt: "0.3rem",
        }}
      ></Stack>
    </Stack>
  );
}
