"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Categories, fotoUploadProps } from "@/types/products";
import { EntradaTexto } from "../inputText/InputText";
import { FormActions } from "./FormActions";
import { UploadPicture } from "../upload/UploadPicture";
import { useAddCategory, useUpdateCategory } from "@/hooks/mutations";
import { useCategoryStore } from "@/contexts";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const INITIAL_CATEGORY_FORM_VALUES: Categories = {
  name: "",
  urlImage: "",
};

export const CategoriesForm = () => {
  const { updateCategoryToEdit, updateIsEditing, isEditing, categoryToEdit } =
    useCategoryStore();
  const router = useRouter();

  const { mutateAsync: addCategory } = useAddCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const EDITING_CATEGORY_FORM_VALUES: Categories = {
    name: categoryToEdit?.name || "",
    urlImage: categoryToEdit?.urlImage || "",
  };

  const categoriesForm = useForm<Categories>({
    defaultValues: isEditing
      ? EDITING_CATEGORY_FORM_VALUES
      : INITIAL_CATEGORY_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const {
    control: categoriesControl,
    getValues: getCategoriesValues,
    reset: resetCategories,
    watch,
  } = categoriesForm;

  const categoryName = watch("name");

  const [fotoCategory, setFotoCategory] = useState<fotoUploadProps | null>(
    categoryToEdit?.urlImage
      ? { base64: categoryToEdit.urlImage, name: "", size: 0, type: "" }
      : null
  );
  const [hovering, setHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    // Quando estiver editando, considere válido se tiver nome e (fotoCategory OU imageBase64 existente)
    return (
      categoryName !== "" &&
      (fotoCategory !== null || (isEditing && categoryToEdit?.urlImage))
    );
  }, [categoryName, fotoCategory, isEditing, categoryToEdit?.urlImage]);

  const handleSaveCategory = useCallback(async () => {
    setIsSubmitting(true);

    const categoryId = categoryToEdit?._id || "";
    const urlImageToEditing = fotoCategory?.base64 || "";

    const categoryPayload: Categories = {
      ...getCategoriesValues(),
      urlImage: isEditing ? urlImageToEditing : fotoCategory?.base64 || "",
    };

    if (isEditing) {
      await updateCategory({
        categoriesId: categoryId,
        categories: categoryPayload,
      });
    } else {
      await addCategory(categoryPayload);
    }

    resetCategories();
    setFotoCategory(null);
    router.push("/categorias");
    setIsSubmitting(false);
  }, [
    categoryToEdit?._id,
    fotoCategory?.base64,
    isEditing,
    router,
    getCategoriesValues,
    resetCategories,
    updateCategory,
    addCategory,
  ]);

  const handleClearForm = useCallback(() => {
    resetCategories(INITIAL_CATEGORY_FORM_VALUES);
    setFotoCategory(null);
    updateIsEditing(false);
    updateCategoryToEdit(null);
  }, [resetCategories, updateIsEditing, updateCategoryToEdit]);

  const handleHover = useCallback((value: boolean) => {
    setHovering(value);
  }, []);

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
            fotoUpload={fotoCategory}
            onRemove={() => {
              setFotoCategory(null);
              if (isEditing && categoryToEdit) {
                // Atualiza o categoryToEdit para refletir a remoção da imagem
                updateCategoryToEdit({
                  ...categoryToEdit,
                  urlImage: "",
                });
              }
            }}
            onHover={handleHover}
            hovering={hovering}
            avatarTitle="Categoria"
            setFotoUpload={setFotoCategory}
            fotoUpdate={fotoCategory ? undefined : categoryToEdit?.urlImage}
          />
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <EntradaTexto
            name="name"
            control={categoriesControl}
            label="Nome da categoria"
          />
        </Stack>
      </Stack>

      <FormActions
        onClear={handleClearForm}
        onSave={handleSaveCategory}
        disabled={!isFormValid}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
      />
    </Stack>
  );
};
