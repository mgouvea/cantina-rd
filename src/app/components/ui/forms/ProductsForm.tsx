"use client";

import { capitalize } from "@/utils";
import { Categories, fotoUploadProps, Products, SubCategories } from "@/types";
import { EntradaTexto } from "../inputText/InputText";
import { FormActions } from "./FormActions";
import { UploadPicture } from "../upload/UploadPicture";
import { useAddProduct, useUpdateProduct } from "@/hooks/mutations";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCategories, useSubCategories } from "@/hooks/queries";
import { useForm } from "react-hook-form";
import { useProductStore } from "@/contexts";
import { useRouter } from "next/navigation";

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";

// Define partial type for form initialization
type ProductFormValues = Omit<Products, "createdAt" | "updatedAt">;

const INITIAL_PROD_FORM_VALUES: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  tag: "",
  categoryId: "",
  subcategoryId: "",
  urlImage: "",
  isActive: true,
};

export const ProductsForm = () => {
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubCategories();

  const { mutateAsync: addProduct } = useAddProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const router = useRouter();
  const { isEditing, updateIsEditing, productToEdit, updateProductToEdit } =
    useProductStore();
  // Ensure productId is a string, not an object
  const productId = productToEdit && productToEdit._id ? productToEdit._id : "";

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

  // Initialize form values when in edit mode
  useEffect(() => {
    if (isEditing && productToEdit) {
      // Set category
      if (typeof productToEdit.categoryId === "string") {
        setSelectedCategory(productToEdit.categoryId);
      }

      // Set subcategory
      if (typeof productToEdit.subcategoryId === "string") {
        setSelectedSubcategory(productToEdit.subcategoryId);

        // Filter subcategories based on selected category
        if (subcategories && typeof productToEdit.categoryId === "string") {
          const filtered = subcategories.filter(
            (subcat: SubCategories) =>
              subcat.categoryId === productToEdit.categoryId
          );
          setFilteredSubcategories(filtered);
        }
      }

      // Set image if available
      if (productToEdit.urlImage && !fotoProduto) {
        // Create a placeholder fotoUpload object for the existing image
        setFotoProduto({
          base64: productToEdit.urlImage,
          name: "existing-image.jpg",
          size: 0,
          type: "image/jpeg",
        });
      }
    }
  }, [isEditing, productToEdit, subcategories, fotoProduto]);

  const EDIT_PROD_FORM_VALUES: ProductFormValues = {
    name: productToEdit?.name || "",
    description: productToEdit?.description || "",
    price: productToEdit?.price || "",
    tag: productToEdit?.tag || "",
    categoryId: productToEdit?.categoryId || "",
    subcategoryId: productToEdit?.subcategoryId || "",
    isActive: productToEdit?.isActive || true,
    urlImage: productToEdit?.urlImage || "",
  };

  const productsForm = useForm<ProductFormValues>({
    defaultValues: isEditing ? EDIT_PROD_FORM_VALUES : INITIAL_PROD_FORM_VALUES,
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
  const productTag = watch("tag");

  // Memoize the form validation to prevent unnecessary re-renders
  const isFormValid = useMemo(() => {
    // In edit mode, we might already have an image in productToEdit
    const hasImage = isEditing
      ? fotoProduto !== null ||
        (productToEdit?.urlImage && productToEdit.urlImage !== "")
      : fotoProduto !== null;

    // In edit mode, we might already have category and subcategory from productToEdit
    const hasCategory = isEditing
      ? selectedCategory !== null ||
        (typeof productToEdit?.categoryId === "string" &&
          productToEdit.categoryId !== "")
      : selectedCategory !== null;

    const hasSubcategory = isEditing
      ? selectedSubcategory !== null ||
        (typeof productToEdit?.subcategoryId === "string" &&
          productToEdit.subcategoryId !== "")
      : selectedSubcategory !== null;

    return (
      productName !== "" &&
      productPrice !== "" &&
      productTag !== "" &&
      hasImage &&
      hasCategory &&
      hasSubcategory
    );
  }, [
    productName,
    productPrice,
    productTag,
    fotoProduto,
    selectedCategory,
    selectedSubcategory,
    isEditing,
    productToEdit,
  ]);

  const handleSaveProducts = useCallback(async () => {
    setIsSubmitting(true);
    const productPayload: Products = {
      ...getProductValues(),
      categoryId: selectedCategory!,
      subcategoryId: selectedSubcategory!,
      price: Number(getProductValues().price),
      urlImage: fotoProduto?.base64 || "",
      createdAt:
        isEditing && productToEdit ? productToEdit.createdAt : new Date(),
      updatedAt: isEditing && productToEdit ? new Date() : undefined,
    };

    if (isEditing) {
      await updateProduct({
        productId: productId,
        product: productPayload,
      });
    } else {
      await addProduct(productPayload);
    }

    resetProducts();
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setFilteredSubcategories([]);
    setFotoProduto(null);
    updateIsEditing(false);
    updateProductToEdit(null);

    router.push("/produtos");

    setIsSubmitting(false);
  }, [
    isEditing,
    selectedCategory,
    selectedSubcategory,
    fotoProduto,
    router,
    productToEdit,
    productId,
    addProduct,
    updateProduct,
    getProductValues,
    resetProducts,
    updateIsEditing,
    updateProductToEdit,
  ]);

  const handleSetCategory = useCallback(
    (event: SelectChangeEvent<string>) => {
      const categoryId = event.target.value;
      setSelectedCategory(categoryId);

      const filtered = subcategories?.filter(
        (subcat: SubCategories) => subcat.categoryId === categoryId
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
    updateIsEditing(false);
    updateProductToEdit(null);
  }, [resetProducts, updateIsEditing, updateProductToEdit]);

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
            fotoUpdate={productToEdit?.urlImage || ""}
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          gap={2}
        >
          <Box sx={{ width: "80%" }}>
            <EntradaTexto
              name="tag"
              control={productsControl}
              label="Tag do produto"
            />
          </Box>
          {getProductValues().tag && (
            <Chip label={`${getProductValues().tag || ""}`} color="success" />
          )}
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
        isEditing={isEditing}
      />
    </Stack>
  );
};
