"use client";

import { Categories, fotoUploadProps, Products, SubCategories } from "@/types";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import { capitalize } from "@/utils";
import { FormActions } from "./FormActions";
import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { useCategories, useSubCategories } from "@/hooks/queries";
import { useAddProduct } from "@/hooks/mutations/useProducts.mutation";
import { useSnackbar } from "../../snackbar/SnackbarProvider";
import { useRouter } from "next/navigation";
import { UploadPicture } from "../uploadFoto/UploadPicture";

// Define partial type for form initialization
type ProductFormValues = Omit<Products, "createdAt" | "updatedAt">;

const INITIAL_PROD_FORM_VALUES: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  subcategoryId: "",
  imageBase64: "",
};

export const ProductsForm = () => {
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubCategories();
  const { mutateAsync: addProduct } = useAddProduct();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategories[]
  >([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const [fotoProduto, setFotoProduto] = useState<fotoUploadProps | null>(null);
  const [hovering, setHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productsForm = useForm<ProductFormValues>({
    defaultValues: INITIAL_PROD_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const {
    control: productsControl,
    getValues: getProductValues,
    reset: resetProducts,
    watch,
  } = productsForm;

  // Watch the required fields for validation
  const productName = watch("name");
  const productPrice = watch("price");

  // Memoize the form validation to prevent unnecessary re-renders
  const isFormValid = useMemo(() => {
    return (
      productName !== "" &&
      productPrice !== "" &&
      fotoProduto !== null &&
      selectedCategory !== null &&
      selectedSubcategory !== null
    );
  }, [
    productName,
    productPrice,
    fotoProduto,
    selectedCategory,
    selectedSubcategory,
  ]);

  const handleSaveProducts = useCallback(async () => {
    setIsSubmitting(true);
    const productPayload: Products = {
      ...getProductValues(),
      categoryId: selectedCategory!,
      subcategoryId: selectedSubcategory!,
      price: Number(getProductValues().price),
      imageBase64: fotoProduto?.base64 || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await addProduct(productPayload);
      showSnackbar({
        message: "Produto cadastrado com sucesso!",
        severity: "success",
      });
      resetProducts();
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setFilteredSubcategories([]);
      setFotoProduto(null);
      router.push("/produtos");
    } catch (error) {
      showSnackbar({
        message: `Erro ao salvar o produto - ${error}`,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    addProduct,
    getProductValues,
    selectedCategory,
    selectedSubcategory,
    fotoProduto,
    resetProducts,
    router,
    showSnackbar,
  ]);

  const handleSetCategory = useCallback(
    (event: SelectChangeEvent<string>) => {
      const categoryId = event.target.value;
      setSelectedCategory(categoryId);

      const filtered = subcategories?.filter(
        (subcategory: SubCategories) => subcategory.categoryId === categoryId
      );
      setFilteredSubcategories(filtered);
      setSelectedSubcategory(null); // Reset subcategory selection when category changes
    },
    [subcategories]
  );

  const handleSetSubcategory = useCallback(
    (event: SelectChangeEvent<string>) => {
      const subcategoryId = event.target.value;
      setSelectedSubcategory(subcategoryId);
    },
    []
  );

  const handleClearForm = useCallback(() => {
    resetProducts(INITIAL_PROD_FORM_VALUES);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setFilteredSubcategories([]);
    setFotoProduto(null);
  }, [resetProducts]);

  const handleHover = useCallback((value: boolean) => {
    setHovering(value);
  }, []);

  // Memoize the filtered categories for better performance
  const memoizedCategories = useMemo(() => {
    return categories || [];
  }, [categories]);

  // Memoize the filtered subcategories for better performance
  const memoizedFilteredSubcategories = useMemo(() => {
    return filteredSubcategories || [];
  }, [filteredSubcategories]);

  return (
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
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
          gap={1}
        >
          <UploadPicture
            fotoUpload={fotoProduto}
            onRemove={() => setFotoProduto(null)}
            onHover={handleHover}
            hovering={hovering}
            avatarTitle="Produto"
            setFotoUpload={setFotoProduto}
          />
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <EntradaTexto
            name="name"
            control={productsControl}
            label="Nome do produto"
          />
          <EntradaTexto
            name="price"
            control={productsControl}
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
              {memoizedCategories?.length === 0 ? (
                <MenuItem disabled value="">
                  Nenhuma categoria cadastrada
                </MenuItem>
              ) : (
                memoizedCategories?.map((category: Categories) => (
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
              disabled={
                !selectedCategory || memoizedFilteredSubcategories?.length === 0
              } // Disable if no category or no subcategories
            >
              {memoizedFilteredSubcategories?.length === 0 ? (
                <MenuItem disabled value="">
                  Nenhuma subcategoria cadastrada
                </MenuItem>
              ) : (
                memoizedFilteredSubcategories?.map(
                  (subcategory: SubCategories) => (
                    <MenuItem key={subcategory._id} value={subcategory._id}>
                      {capitalize(subcategory.name)}
                    </MenuItem>
                  )
                )
              )}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <EntradaTexto
            name="description"
            control={productsControl}
            label="Descrição"
            props={{ multiline: true, rows: 4 }}
          />
        </Stack>
      </Stack>

      <FormActions
        onClear={handleClearForm}
        onSave={handleSaveProducts}
        disabled={!isFormValid}
        isSubmitting={isSubmitting}
      />
    </Stack>
  );
};
