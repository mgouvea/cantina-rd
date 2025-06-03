"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import Text from "@/app/components/ui/text/Text";
import { a11yProps } from "@/utils";
import { Box, IconButton, Stack, Tab, Tabs, Tooltip } from "@mui/material";
import { CustomTabPanel } from "@/app/components";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

export default function EditGroupFamilyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  const router = useRouter();

  const breadcrumbItems = [
    { label: "Início", href: "/dashboard" },
    { label: "Grupo Familiar", href: "/grupo-familiar" },
    { label: "Editar" },
  ];

  const [value, setValue] = useState(0);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    []
  );

  const handleBack = useCallback(() => {
    router.replace("/grupo-familiar");
  }, [router]);

  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5" fontWeight="bold">
          Editar Grupo Familiar
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
              icon={<GroupAddOutlinedIcon />}
              label="Grupo Familiar"
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          {children}
        </CustomTabPanel>
      </Stack>
    </Stack>
  );
}
