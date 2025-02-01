"use client";

import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Text from "@/app/components/ui/text/Text";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { Botao, EntradaTexto } from "@/app/components";
import { useForm } from "react-hook-form";
import { Categories, Products, SubCategories } from "@/types/products";
import { useCategories, useSubCategories } from "@/hooks/queries";
import { capitalize } from "@/utils";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, dir, ...other } = props;

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
  { label: "Início", href: "/painel" },
  { label: "Produtos", href: "/painel/produtos" },
  { label: "Novo" },
];

const INITIAL_PROD_FORM_VALUES = {
  name: "",
  description: "",
  price: "",
  category: "",
  subcategory: "",
};

export default function NovoProduto() {
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubCategories();

  const theme = useTheme();
  const router = useRouter();

  const [value, setValue] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategories[]
  >([]); // Correct type here
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  ); // Store the ID

  // --------------Products----------------
  const productsForm = useForm<Products>({
    defaultValues: INITIAL_PROD_FORM_VALUES,
  });
  const {
    control: productsControl,
    getValues: getProductValues,
    reset: resetProducts,
  } = productsForm;

  // --------------Handlers----------------
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSaveProducts = async () => {
    const productPayload: Products = {
      ...getProductValues(),
      category: selectedCategory!,
      subcategory: selectedSubcategory!,
    };
    console.log("Salvar produto", productPayload);
  };

  const handleSetCategory = (event: SelectChangeEvent<string>) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    const filtered = subcategories?.filter(
      (subcategory: SubCategories) => subcategory.categoryId === categoryId // Correct type here
    );
    setFilteredSubcategories(filtered);
    setSelectedSubcategory(null); // Reset subcategory selection when category changes
  };

  const handleSetSubcategory = (event: SelectChangeEvent<string>) => {
    const subcategoryId = event.target.value;
    setSelectedSubcategory(subcategoryId);
  };

  // --------------Render----------------
  return (
    <Stack>
      <GenericBreadcrumbs items={breadcrumbItems} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5" fontWeight="bold">
          Cadastrar{" "}
          {value === 0
            ? "novo produto"
            : value === 1
            ? "nova categoria"
            : "nova subcategoria"}
        </Text>
        <IconButton
          sx={{
            backgroundColor: "success.dark",
            "&:hover": { backgroundColor: "success.main", transition: "0.3s" },
          }}
          onClick={() => router.replace("/painel/produtos")}
        >
          <Tooltip title="Voltar">
            <ArrowBackIcon fontSize="medium" sx={{ color: "#fff" }} />
          </Tooltip>
        </IconButton>
      </Stack>

      <Stack
        sx={{
          width: "100%",
          minHeight: "500px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: "16px",
          mt: 5,
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
          >
            <Tab
              icon={<FastfoodRoundedIcon />}
              label="Produto"
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          <ProductsForm
            control={productsControl}
            handleSaveProducts={handleSaveProducts}
            reset={resetProducts}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            filteredSubcategories={filteredSubcategories}
            handleSetCategory={handleSetCategory}
            handleSetSubcategory={handleSetSubcategory}
            categories={categories}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubcategory={setSelectedSubcategory}
            setFilteredSubcategories={setFilteredSubcategories}
          />
        </CustomTabPanel>
      </Stack>
    </Stack>
  );
}

const FormActions = ({
  onClear,
  onSave,
  disabled,
  setSelectedCategory,
  setSelectedSubcategory,
  setFilteredSubcategories,
}: any) => (
  <Box
    sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 3 }}
  >
    <Botao
      variant="contained"
      color="error"
      onClick={() => {
        onClear();
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setFilteredSubcategories([]);
      }}
      sx={{ paddingX: 7, borderRadius: "8px" }}
    >
      Limpar
    </Botao>
    <Botao
      variant="contained"
      color="success"
      onClick={onSave}
      disabled={disabled}
      sx={{ paddingX: 10, borderRadius: "8px" }}
    >
      Cadastrar
    </Botao>
  </Box>
);

const ProductsForm = ({
  control,
  handleSaveProducts,
  reset,
  selectedCategory,
  selectedSubcategory,
  filteredSubcategories,
  handleSetCategory,
  handleSetSubcategory,
  categories,
  setSelectedCategory,
  setSelectedSubcategory,
  setFilteredSubcategories,
}: any) => (
  <Stack gap={2}>
    <Stack
      sx={{
        px: 25,
        pt: 2,
        width: "80%",
        margin: "0 auto",
      }}
      gap={2}
    >
      <Stack direction="row" gap={1}>
        <EntradaTexto name="name" control={control} label="Nome do produto" />
        <EntradaTexto name="price" control={control} label="Preço de venda" />
      </Stack>

      <Stack direction="row" gap={1}>
        <FormControl
          sx={{
            width: "100%",
          }}
        >
          <InputLabel id="owner-select-label">Categoria</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Categoria"
            onChange={handleSetCategory}
          >
            {categories?.length === 0 ? (
              <MenuItem disabled value="">
                Nenhuma categoria cadastrada
              </MenuItem>
            ) : (
              categories?.map((category: Categories) => (
                <MenuItem key={category._id} value={category._id}>
                  {capitalize(category.name)}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Subcategory */}

        <FormControl
          sx={{
            width: "100%",
          }}
        >
          <InputLabel id="owner-select-label">Subcategoria</InputLabel>
          <Select
            labelId="subcategory-select-label"
            id="subcategory-select"
            value={selectedSubcategory}
            label="Subcategoria"
            onChange={handleSetSubcategory}
            disabled={!selectedCategory || filteredSubcategories?.length === 0} // Disable if no category or no subcategories
          >
            {filteredSubcategories?.length === 0 ? (
              <MenuItem disabled value="">
                Nenhuma subcategoria cadastrada
              </MenuItem>
            ) : (
              filteredSubcategories?.map((subcategory: SubCategories) => (
                <MenuItem key={subcategory._id} value={subcategory._id}>
                  {" "}
                  {capitalize(subcategory.name)}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" gap={1}>
        <EntradaTexto
          name="description"
          control={control}
          label="Descrição"
          props={{ multiline: true, rows: 4 }}
        />
      </Stack>
    </Stack>

    <FormActions
      onClear={() => reset(INITIAL_PROD_FORM_VALUES)}
      onSave={handleSaveProducts}
      // disabled={!isModified}
      setSelectedCategory={setSelectedCategory}
      setSelectedSubcategory={setSelectedSubcategory}
      setFilteredSubcategories={setFilteredSubcategories}
    />
  </Stack>
);
