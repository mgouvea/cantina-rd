"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Text from "@/app/components/ui/text/Text";
import { Box, IconButton, Stack, Tooltip, useTheme } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import {
  CategoriesForm,
  CustomTabPanel,
  SubCategoriesForm,
} from "@/app/components";
import { a11yProps } from "@/utils";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Categorias", href: "/categorias" },
  { label: "Novo" },
];

// Componente interno para lidar com a lógica dependente de searchParams
const CategoriasContent = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab from URL query parameter or default to 0
  const initialTab = searchParams.get('tab') ? parseInt(searchParams.get('tab')!) : 0;
  const [value, setValue] = useState(initialTab);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5" fontWeight="bold">
          Cadastrar {value === 0 ? "nova categoria" : "nova subcategoria"}
        </Text>
        <IconButton
          sx={{
            backgroundColor: "success.dark",
            "&:hover": { backgroundColor: "success.main", transition: "0.3s" },
          }}
          onClick={() => {
            if (value === 1) {
              router.replace("/categorias?tab=1");
            } else {
              router.replace("/categorias");
            }
          }}
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
              icon={<CategoryOutlinedIcon />}
              label="Categoria"
              {...a11yProps(0)}
            />
            <Tab
              icon={<ListOutlinedIcon />}
              label="Subcategoria"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          <CategoriesForm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} dir={theme.direction}>
          <SubCategoriesForm />
        </CustomTabPanel>
      </Stack>
    </>
  );
};

export default function NovoCategoria() {
  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />
      <Suspense fallback={<Text>Carregando conteúdo...</Text>}>
        <CategoriasContent />
      </Suspense>
    </Stack>
  );
}
