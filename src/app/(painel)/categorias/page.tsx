"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Loading from "@/app/components/loading/Loading";
import TabelaCategorias from "@/app/components/ui/tables/TabelaCategorias";
import { useCategories } from "@/hooks/queries";
import { Box, Stack, Tabs, Tab, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { a11yProps } from "@/utils";
import { CustomTabPanel } from "@/app/components";
import TabelaSubcategorias from "@/app/components/ui/tables/TabelaSubcategoria";
import { useSubCategories } from "@/hooks/queries";
import { useCategoryStore } from "@/contexts/store/categories.store";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Categorias" },
];

export default function CategoriasPage() {
  const theme = useTheme();
  const { data: categories, isLoading } = useCategories();
  const { data: subCategories, isLoading: subCategoriesLoading } =
    useSubCategories();
  const [value, setValue] = useState(0);
  const { update } = useCategoryStore();

  useEffect(() => {
    update(categories);
  }, [categories, update]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return (
      <Stack>
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
          <TabelaCategorias data={categories} isLoading={isLoading} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} dir={theme.direction}>
          <TabelaSubcategorias
            data={subCategories}
            isLoading={subCategoriesLoading}
          />
        </CustomTabPanel>
      </Stack>
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
