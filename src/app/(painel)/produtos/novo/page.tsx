"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Text from "@/app/components/ui/text/Text";
import { Box, IconButton, Stack, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProductsForm } from "@/app/components";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, height: "100%" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Produtos", href: "/produtos" },
  { label: "Novo" },
];

export default function NovoProduto() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ px: isMobile ? 1 : 0 }}>
      {!isMobile && <GenericBreadcrumbs items={breadcrumbItems} />}

      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{ mt: isMobile ? 1 : 0 }}
      >
        <Text variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          {isMobile ? "Novo produto" : "Cadastrar novo produto"}
        </Text>
        <IconButton
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: "success.dark",
            "&:hover": { backgroundColor: "success.main", transition: "0.3s" },
          }}
          onClick={() => router.replace("/produtos")}
        >
          <Tooltip title="Voltar">
            <ArrowBackIcon fontSize={isMobile ? "small" : "medium"} sx={{ color: "#fff" }} />
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
          overflow: "hidden",
          boxShadow: isMobile ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            position: isMobile ? "sticky" : "static",
            top: isMobile ? 0 : "auto",
            zIndex: isMobile ? 10 : 1,
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
                minHeight: isMobile ? "48px" : "64px",
                py: isMobile ? 0.5 : 1,
              },
            }}
          >
            <Tab
              icon={isMobile ? undefined : <FastfoodRoundedIcon />}
              iconPosition="start"
              label="Produto"
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          <Box sx={{ p: isMobile ? 0 : 2 }}>
            <ProductsForm />
          </Box>
        </CustomTabPanel>
      </Stack>
    </Stack>
  );
}
