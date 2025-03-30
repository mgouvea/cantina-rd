"use client";

import { Control, UseFormReset, useForm } from "react-hook-form";
import { Categories, Products, SubCategories } from "@/types/products";
import { useCategories, useSubCategories } from "@/hooks/queries";
import { capitalize } from "@/utils";
import GenericBreadcrumbs from "@/app/components/breadcrumb/GenericBreadcrumb";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Text from "@/app/components/ui/text/Text";
import {
  Avatar,
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
import { ChangeEvent, useState } from "react";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { Botao, EntradaTexto, useSnackbar } from "@/app/components";
import { useAddProduct } from "@/hooks/mutations/useProducts.mutation";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddIcon from "@mui/icons-material/Add";
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
  const { mutateAsync: addProduct } = useAddProduct();
  const { showSnackbar } = useSnackbar();

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
  const [fotoProduto, setFotoProduto] = useState<fotoProdutoProps | null>(null);
  const [hovering, setHovering] = useState(false);

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

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data:image prefix from base64 string if it exists
      const base64Clean = base64.includes("base64,")
        ? base64
        : base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

      setFotoProduto({
        base64: base64Clean,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProducts = async () => {
    const productPayload: Products = {
      ...getProductValues(),
      categoryId: selectedCategory!,
      subcategoryId: selectedSubcategory!,
      price: Number(getProductValues().price),
      imageBase64: fotoProduto?.base64 || "",
    };

    console.log(productPayload);

    try {
      await addProduct(productPayload);
      showSnackbar({
        message: "Produto cadastrado com sucesso!",
        severity: "success",
      });
      resetProducts();
      router.push("/painel/produtos");
    } catch (error) {
      showSnackbar({
        message: `Erro ao salvar o produto - ${error}`,
        severity: "error",
      });
    }
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
            fotoProduto={fotoProduto}
            setFotoProduto={setFotoProduto}
            hovering={hovering}
            setHovering={setHovering}
            handleUploadFile={handleUploadFile}
          />
        </CustomTabPanel>
      </Stack>
    </Stack>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: string;
}

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  disabled?: boolean;
  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: string | null) => void;
  setFilteredSubcategories: (value: SubCategories[]) => void;
}

const FormActions = ({
  onClear,
  onSave,
  disabled,
  setSelectedCategory,
  setSelectedSubcategory,
  setFilteredSubcategories,
}: FormActionsProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 2,
      marginTop: 3,
      px: { xs: 2, sm: 4 },
    }}
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

interface ProductsFormProps {
  control: Control<Products>;
  handleSaveProducts: () => void;
  reset: UseFormReset<Products>;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  filteredSubcategories: SubCategories[];
  handleSetCategory: (event: SelectChangeEvent<string>) => void;
  handleSetSubcategory: (event: SelectChangeEvent<string>) => void;
  categories: Categories[] | undefined;
  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: string | null) => void;
  setFilteredSubcategories: (value: SubCategories[]) => void;
  fotoProduto: fotoProdutoProps | null;
  setFotoProduto: (value: fotoProdutoProps | null) => void;
  hovering: boolean;
  setHovering: (value: boolean) => void;
  handleUploadFile: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface fotoProdutoProps {
  base64: string;
  name: string;
  size: number;
  type: string;
}

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
  fotoProduto,
  setFotoProduto,
  hovering,
  setHovering,
  handleUploadFile,
}: ProductsFormProps) => (
  <Stack gap={2}>
    <Stack
      sx={{
        px: { xs: 2, sm: 4, md: 25 },
        pt: 2,
        width: { xs: "100%", md: "80%" },
        margin: "0 auto",
      }}
      gap={2}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", justifyContent: "end" }}
        gap={1}
      >
        <ProductPicture
          fotoProduto={fotoProduto}
          onRemove={() => setFotoProduto(null)}
          onHover={setHovering}
          hovering={hovering}
        />
        <UploadImageButton onUpload={handleUploadFile} />
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
        <EntradaTexto name="name" control={control} label="Nome do produto" />
        <EntradaTexto
          name="price"
          control={control}
          label="R$ - Preço de venda"
          type="number"
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
        <FormControl
          sx={{
            width: "100%",
          }}
        >
          <InputLabel id="owner-select-label">Categoria</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory || ""}
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
            value={selectedSubcategory || ""}
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

      <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
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

const ProductPicture = ({
  fotoProduto,
  onRemove,
  onHover,
  hovering,
}: {
  fotoProduto: fotoProdutoProps | null;
  onRemove: () => void;
  onHover: (hover: boolean) => void;
  hovering: boolean;
}) => (
  <Box
    sx={{ position: "relative", display: "inline-block" }}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
  >
    <Avatar
      alt="Foto do Produto"
      sx={{
        width: 106,
        height: 106,
        cursor: fotoProduto ? "pointer" : "default",
      }}
      src={fotoProduto?.base64}
    >
      {fotoProduto ? "" : "Produto"}
    </Avatar>
    {hovering && fotoProduto && (
      <IconButton
        onClick={onRemove}
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
        }}
      >
        <ClearOutlinedIcon sx={{ color: "error.main" }} />
      </IconButton>
    )}
  </Box>
);

const UploadImageButton = ({
  onUpload,
}: {
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
    <input
      type="file"
      accept=".png,.jpg"
      onChange={onUpload}
      style={{ display: "none" }}
      id="file-input"
    />
    <label htmlFor="file-input">
      <Botao
        variant="outlined"
        startIcon={<AddIcon />}
        color="primary"
        component="span"
        sx={{ width: "fit-content" }}
      >
        Alterar foto do produto
      </Botao>
    </label>
  </Box>
);
