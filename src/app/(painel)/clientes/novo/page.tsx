"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Text from "@/app/components/ui/text/Text";
import { a11yProps } from "@/utils";
import { Box, IconButton, Stack, Tab, Tabs, Tooltip } from "@mui/material";
import { CustomTabPanel } from "@/app/components";
import { FormClients } from "@/app/components/ui/forms/FormClients";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";

export default function NovoCliente() {
  const theme = useTheme();
  const router = useRouter();

  const breadcrumbItems = [
    { label: "Início", href: "/dashboard" },
    { label: "Cliente", href: "/clientes" },
    { label: "Novo" },
  ];

  const [value, setValue] = useState(0);
  
  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }, []);
  
  const handleBack = useCallback(() => {
    router.replace("/clientes");
  }, [router]);

  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5" fontWeight="bold">
          Cadastrar Novo cliente
        </Text>
        <IconButton
          sx={{
            backgroundColor: "success.dark",
            "&:hover": { backgroundColor: "success.main", transition: "0.3s" },
          }}
          onClick={handleBack}
        >
          <Tooltip title="Voltar">
            <ArrowBackIcon fontSize="medium" sx={{ color: "#fff" }} />
          </Tooltip>
        </IconButton>
      </Stack>

      <Stack
        sx={{
          width: "100%",
          minHeight: { xs: "auto", md: "500px" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: { xs: "8px", md: "16px" },
          mt: { xs: 2, md: 5 },
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              "& .Mui-selected": {
                backgroundColor: "background.paper",
                color: "text.primary",
                fontWeight: "bold",
              },
              "& .Mui-selected:hover": {
                backgroundColor: "background.paper",
                color: "text.primary",
                fontWeight: "bold",
              },
              "& .MuiTab-root": {
                backgroundColor: "background.paper",
                color: "text.primary",
              },
            }}
          >
            <Tab
              icon={<PersonOutlineOutlinedIcon />}
              label="Cliente"
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          <FormClients />
        </CustomTabPanel>
      </Stack>
    </Stack>
  );
}
