"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { capitalize } from "@/utils";
import { Categories, SubCategories } from "@/types/products";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import { FormActions } from "./FormActions";
import { useAddSubCategory, useUpdateSubCategory } from "@/hooks/mutations";
import { useCategories } from "@/hooks/queries";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../../snackbar/SnackbarProvider";
import { useSubCategoryStore } from "@/contexts";

import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  FormControl,
  InputLabel,
} from "@mui/material";

const INITIAL_SUBCATEGORY_FORM_VALUES = {
  name: "",
};

export const SubCategoriesForm = () => {
  const {
    isEditing,
    subCategoryToEdit,
    updateIsEditing,
    updateSubCategoryToEdit,
  } = useSubCategoryStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { showSnackbar } = useSnackbar();

  const { mutateAsync: addSubCategory } = useAddSubCategory();
  const { mutateAsync: updateSubCategory } = useUpdateSubCategory();

  const { data: categories } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    isEditing && subCategoryToEdit ? subCategoryToEdit.categoryId : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const EDITING_SUBCATEGORY_FORM_VALUES = {
    name: subCategoryToEdit?.name || "",
  };

  const subCategoriesForm = useForm<SubCategories>({
    defaultValues: isEditing
      ? EDITING_SUBCATEGORY_FORM_VALUES
      : INITIAL_SUBCATEGORY_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });
  const {
    control: subCategoriesControl,
    getValues: getSubCategoriesValues,
    reset: resetSubCategories,
    watch,
  } = subCategoriesForm;

  // Watch the name field for changes
  const subcategoryName = watch("name");

  useEffect(() => {
    if (categories && categories.length > 0) {
      const lanchesCategory = categories.find(
        (category: Categories) => category.name.toLowerCase() === "lanches"
      );
      if (lanchesCategory && !isEditing) {
        setSelectedCategory(lanchesCategory._id);
      }
    }
  }, [categories, isEditing]);

  // Memoize the form validation to prevent unnecessary re-renders
  const isFormValid = useMemo(() => {
    return subcategoryName !== "" && selectedCategory !== null;
  }, [subcategoryName, selectedCategory]);

  const handleSetCategory = useCallback((event: SelectChangeEvent<string>) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
  }, []);

  const handleSaveSubCategory = useCallback(async () => {
    setIsSubmitting(true);
    const subCategoryId = subCategoryToEdit?._id || "";
    const subCategoryPayload: SubCategories = {
      ...getSubCategoriesValues(),
      categoryId: selectedCategory!,
    };

    try {
      if (isEditing) {
        await updateSubCategory({
          subCategoriesId: subCategoryId,
          subCategories: subCategoryPayload,
        });
      } else {
        await addSubCategory(subCategoryPayload);
      }
      showSnackbar({
        message: `Subcategoria ${
          isEditing ? "editada" : "cadastrada"
        } com sucesso!`,
        severity: "success",
      });
      resetSubCategories(INITIAL_SUBCATEGORY_FORM_VALUES);
      setSelectedCategory(null);
      updateIsEditing(false);
      updateSubCategoryToEdit(null);

      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
      router.push("/categorias?tab=1");
    } catch (error) {
      showSnackbar({
        message: `Erro ao ${isEditing ? "editar" : "cadastrar"} a subcategoria`,
        severity: "error",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    router,
    selectedCategory,
    queryClient,
    isEditing,
    subCategoryToEdit,
    updateSubCategory,
    showSnackbar,
    addSubCategory,
    getSubCategoriesValues,
    resetSubCategories,
    updateIsEditing,
    updateSubCategoryToEdit,
  ]);

  const handleClearForm = useCallback(() => {
    resetSubCategories(INITIAL_SUBCATEGORY_FORM_VALUES);
    updateIsEditing(false);
    updateSubCategoryToEdit(null);
  }, [resetSubCategories, updateIsEditing, updateSubCategoryToEdit]);

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
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <EntradaTexto
            name="name"
            control={subCategoriesControl}
            label="Nome da subcategoria"
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              id="category-select-label"
              sx={{ backgroundColor: "white", px: 1 }}
            >
              Categoria pai
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory || ""}
              onChange={handleSetCategory}
              label="Categoria pai"
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "8px",
                },
                "& .MuiSelect-select": {
                  paddingLeft: "22px",
                },
              }}
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
        </Stack>
      </Stack>

      <FormActions
        onClear={handleClearForm}
        onSave={handleSaveSubCategory}
        disabled={!isFormValid}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
      />
    </Stack>
  );
};
